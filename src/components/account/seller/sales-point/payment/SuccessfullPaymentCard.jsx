import React from 'react';
import { useRouter } from 'next/navigation';
import {
  getTotalCashOfferDiscount,
  getVATAmount,
  itemTotalCost,
  productsTax,
  subtotal,
} from '../cart/CartBillCalculationFunctions';
import SuccessfulPaymentDisplay from './SuccessfulPaymentDisplay';
import { useAuth } from '@/contexts/authContext';
import { useNotification } from '@/contexts/notificationContext';
import printReceipt from '../receipt-management/PrintReceipt';
import SendReceipt from '../receipt-management/SendReceipt';
import { sendReceiptService } from '@/services/transactionServices';
import { useNewCustomerRegistration } from '@/contexts/newCustomerRegistrationContect';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { flattenProductOffers, getCashOfferLines } from '../cart/offerHelpers';
import { SCHEDULED_PRICE_NOTICE } from './PaymentProgress';

const SuccessfullPaymentCard = ({
  paymentData,
  paidOrderDetails,
  mode,
  workBranch,
  lightThemeStyle,
  darkThemeStyle,
  showReceipt,
  setShowReceipt,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { setRegistrationData } = useNewCustomerRegistration();
  const [openSendReceipt, setOpenSendReceipt] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const handleOpenNewCustomerRegistration = () => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline) {
      showNotification(
        'error',
        'Offline',
        'You are currently offline. Sorry, you cannot register a new customer while offline.',
        4000
      );
      return;
    }

    setRegistrationData({
      token: showReceipt?.customerRegToken || null,
      orderId: showReceipt?.order?.orderId || null,
      branch: workBranch,
    });

    handlePrintReceipt();
    router.push('/pages/account/sales-point/new-customer-registration');
  };

  const workBranchVATRate =
    workBranch && workBranch.taxBand?.rates[0]?.rate
      ? workBranch.taxBand.rates[0].rate
      : 0;

  const orderDateString = (dateTimeString) =>
    new Date(dateTimeString).toLocaleDateString();
  // Format the time to 12-hour format with AM/PM
  const orderTime = (dateTimeString) =>
    new Date(dateTimeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      formatMatcher: 'basic',
    });

  // paymentStatus.amountPaid: paid in total so far; amountPaidNow: at this checkout; paidBefore: earlier
  const unpaidBalance =
    paymentData?.total - paymentData?.paymentStatus?.amountPaid;
  const paidBefore = paymentData?.paymentStatus?.paidBefore || 0;
  const amountPaidNow = paymentData?.paymentStatus?.amountPaidNow || 0;

  const isScheduled =
    paymentData?.selectedFulfillmentTime === 'Now' ? false : true;

  const cashOffers = () =>
    paidOrderDetails?.linkedCustomer?.appliedOffers?.filter(
      (offer) => offer.type === 'cash'
    ) || [];

  const cashDiscounts = () =>
    getTotalCashOfferDiscount(cashOffers(), paidOrderDetails?.items) || 0;

  // VAT on the subtotal after cash discounts, the same way the cart and the saved sale work it out
  const vatAmount = () =>
    getVATAmount(paidOrderDetails?.items, cashOffers(), workBranchVATRate) || 0;

  // every free product handed over, one entry per product (rewards can hold several picks)
  const productOffers = () =>
    flattenProductOffers(paidOrderDetails?.linkedCustomer?.appliedOffers || []);

  // one line per applied cash offer with its own amount
  const cashOfferLines = () =>
    getCashOfferLines(
      paidOrderDetails?.linkedCustomer?.appliedOffers || [],
      subtotal(paidOrderDetails?.items) || 0
    );

  const currency = paidOrderDetails?.items?.[0]?.product?.currency || '';

  const freeItemsForReceipt = () =>
    productOffers().map((offer) => ({
      name: offer?.product?.name || 'Free item',
      quantity: offer?.quantity || 1,
      price: 'FREE',
      isFree: true,
      promo: offer?.description || '',
      options: (offer?.selectedChoices || []).map((choice) => ({
        additionalPrice: 0, // choices on a reward item are free too
        name: choice?.material?.name || 'Option',
      })),
    }));

  const discountsForReceipt = () =>
    cashOfferLines().map((line) => ({
      description: line.description,
      label: line.label,
      amount: commaNumberFormat(line.amount, 2),
    }));

  const getReceiptData = () => ({
    transactionId: paidOrderDetails?.orderId,
    // structured copies for receipt templates that want to lay these out themselves
    freeItems: freeItemsForReceipt(),
    discounts: discountsForReceipt(),
    metaData: {
      title: isScheduled
        ? `Advanced order note for - ${orderDateString(paymentData?.orderScheduledDateTime)}, ${orderTime(paymentData?.orderScheduledDateTime)}`
        : 'Sales Receipt',
      storeName: workBranch?.name || 'Store Name',
      address: workBranch?.address || 'Store Address',
      phone: workBranch?.phoneNumber || 'Store Phone',
      date: `${orderDateString(paymentData?.paymentStatus?.time)}, ${orderTime(paymentData?.paymentStatus?.time)}`,
      cashierName: user?.fullName || ' ',
    },
    // free items go in the item list too (price 'FREE') so every receipt channel shows them
    listOfItems: [
      ...(paidOrderDetails?.items?.map((item) => ({
        name: item?.product?.name || 'Item...',
        quantity: item?.quantity || 0,
        price: commaNumberFormat(itemTotalCost(item), 2) || 0,
        options:
          item?.choices?.map((choiceObj) => ({
            additionalPrice: choiceObj?.choice?.additionalPrice || 0,
            name: choiceObj?.choice?.material?.name || 'Option',
          })) || [],
      })) || []),
      ...freeItemsForReceipt(),
    ],
    endNotes: [
      {
        label: 'Subtotal:',
        value: `${commaNumberFormat(subtotal(paidOrderDetails?.items), 2)}`,
      },
      {
        label: `Tax (${commaNumberFormat(workBranchVATRate, 2)}%)`,
        value: `${commaNumberFormat(vatAmount(), 2)}`,
      },
      productsTax(paidOrderDetails?.items) > 0
        ? {
            label: 'Products Tax:',
            value: `${commaNumberFormat(productsTax(paidOrderDetails?.items), 2)}`,
          }
        : false,
      // one line per cash offer, then the combined total when there is more than one
      ...discountsForReceipt().map((d) => ({
        label: `Discount - ${d.description}${d.label ? ` (${d.label})` : ''}:`,
        value: `- ${d.amount}`,
      })),
      cashOfferLines().length > 1
        ? {
            label: 'Total Discounts:',
            value: `- ${commaNumberFormat(cashDiscounts(), 2)}`,
          }
        : false,
      {
        // a scheduled order's price is only fixed when it is collected
        label: isScheduled ? 'Estimated Total:' : 'Total Amount:',
        value: `${commaNumberFormat(paymentData?.total, 2) || '0.00'}`,
      },
      // paid at earlier checkouts (a scheduled order's deposits), then at this one
      paidBefore > 0
        ? {
            label: 'Paid Earlier:',
            value: `${commaNumberFormat(paidBefore, 2)}`,
          }
        : false,
      isScheduled || paidBefore > 0
        ? {
            label: 'Paid Now:',
            value: `${commaNumberFormat(amountPaidNow, 2) || '0.00'}`,
          }
        : false,
      isScheduled
        ? unpaidBalance > 0 && {
            label: 'Unpaid Balance:',
            value: `${commaNumberFormat(unpaidBalance, 2)}`,
          }
        : false,
    ].filter(Boolean),
    footer: isScheduled
      ? `${SCHEDULED_PRICE_NOTICE} Thank you for your order!`
      : 'Thank you for your purchase! Visit again!',
  });

  const receiptText = (() => {
    const receiptData = getReceiptData();

    const itemsText = receiptData.listOfItems
      .map((item, index) => {
        const optionsText =
          item.options?.length > 0
            ? ` (${item.options.map((option) => option.name).join(', ')})`
            : '';
        if (item.isFree) {
          const promoText = item.promo ? ` [${item.promo}]` : '';
          return `${index + 1}. ${item.name}${optionsText} x${item.quantity} - FREE${promoText}`;
        }
        // price is already a formatted string (e.g. "1,250.00")
        return `${index + 1}. ${item.name}${optionsText} x${item.quantity} - ${item.price}`;
      })
      .join('\n');

    const totalsText = receiptData.endNotes
      ?.map((note) => `${note.label} ${note?.value}`)
      ?.join('\n');

    return [
      receiptData.metaData.title,
      receiptData.metaData.storeName,
      receiptData.metaData.address,
      receiptData.metaData.phone,
      `Date: ${receiptData.metaData.date}`,
      `Cashier: ${receiptData.metaData.cashierName}`,
      `Transaction ID: ${receiptData.transactionId}`,
      '',
      'Items:',
      itemsText,
      '',
      totalsText,
      '',
      receiptData.footer,
    ].join('\n');
  })();

  const handleSendReceipt = () => {
    setOpenSendReceipt(true);
  };

  const handleSendEmailReceipt = async () => {
    setIsSending(true);

    try {
      const receiptData = getReceiptData();
      const response = await sendReceiptService({
        transactionId: paidOrderDetails?.orderId,
        channel: 'email',
        recipient: {
          email: paidOrderDetails?.linkedCustomer?.email,
          customerId: paidOrderDetails?.linkedCustomer?._id,
          customerName: paidOrderDetails?.linkedCustomer?.name,
        },
        receiptData: receiptData,
      });

      if (response?.error) {
        showNotification('error', 'Email Send Failed', response.error, 4000);
        setIsSending(false);
        return;
      }

      showNotification(
        'success',
        'Receipt Sent',
        `Receipt sent to ${paidOrderDetails?.linkedCustomer?.email} successfully`,
        3000
      );
      setOpenSendReceipt(false);
      setShowReceipt({ success: false, order: null });
    } catch (error) {
      console.error(error || 'error sending receipt');
    } finally {
      setIsSending(false);
    }
  };

  //TODO: Implement WhatsApp receipt sending functionality in the service and handle response accordingly
  const handleSendWhatsappReceipt = async () => {
    setIsSending(true);
    try {
      showNotification(
        'Warning',
        'WhatsApp Service unavailable',
        'Whatsapp receipt method is currently unavailable...',
        3000
      );

      setOpenSendReceipt(false);
      setShowReceipt({ success: false, order: null });
    } catch (error) {
      console.error(error || 'error sending whatsapp receipt');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrintReceipt = () => {
    setIsSending(true);
    try {
      const receiptData = getReceiptData();
      printReceipt(receiptData);
      setShowReceipt({ success: false, order: null });
    } catch (error) {
      console.error(error || 'error printing receipt');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <SuccessfulPaymentDisplay
        paymentData={paymentData}
        paidOrderDetails={paidOrderDetails}
        mode={mode}
        lightThemeStyle={lightThemeStyle}
        darkThemeStyle={darkThemeStyle}
        setShowReceipt={setShowReceipt}
        showReceipt={showReceipt}
        handlePrintReceipt={handlePrintReceipt}
        handleSendReceipt={handleSendReceipt}
        isScheduled={isScheduled}
        unpaidBalance={unpaidBalance}
        orderDateString={orderDateString}
        orderTime={orderTime}
        cashDiscounts={cashDiscounts}
        cashOfferLines={cashOfferLines}
        vatAmount={vatAmount}
        currency={currency}
        productOffers={productOffers}
        workBranchVATRate={workBranchVATRate}
        handleOpenNewCustomerRegistration={handleOpenNewCustomerRegistration}
      />

      {openSendReceipt && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 p-3 h-full">
          <SendReceipt
            linkedCustomer={paidOrderDetails?.linkedCustomer}
            receiptText={receiptText}
            isScheduled={isScheduled}
            onClose={() => setOpenSendReceipt(false)}
            onSendEmail={handleSendEmailReceipt}
            onSendWhatsapp={handleSendWhatsappReceipt}
            isSending={isSending}
          />
        </div>
      )}
    </>
  );
};

export default SuccessfullPaymentCard;
