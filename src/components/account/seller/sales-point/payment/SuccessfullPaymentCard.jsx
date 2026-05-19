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
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);

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

  const unpaidBalance =
    paymentData?.total - paymentData?.paymentStatus?.amountPaid;

  const isScheduled =
    paymentData?.selectedFulfillmentTime === 'Now' ? false : true;

  const cashDiscounts = () => {
    const cashOffers =
      paidOrderDetails?.linkedCustomer?.appliedOffers?.filter(
        (offer) => offer.type === 'cash'
      ) || [];

    return getTotalCashOfferDiscount(cashOffers, paidOrderDetails?.items) || 0;
  };

  const productOffers = () => {
    const offers =
      paidOrderDetails?.linkedCustomer?.appliedOffers?.filter(
        (offer) => offer.type === 'product'
      ) || [];
    const result = offers?.map((offer) => {
      const productDetails = offer?.productDetails;
      return {
        ...productDetails,
        selectedChoices: Object.values(productDetails.selectedChoices) || [],
      };
    });
    return result;
  };

  const getReceiptData = () => ({
    transactionId: paidOrderDetails?.orderId,
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
    listOfItems:
      paidOrderDetails?.items?.map((item) => ({
        name: item?.product?.name || 'Item...',
        quantity: item?.quantity || 0,
        price: itemTotalCost(item) || 0,
        options:
          item?.choices?.map((choiceObj) => ({
            additionalPrice: choiceObj?.choice?.additionalPrice || 0,
            name: choiceObj?.choice?.material?.name || 'Option',
          })) || [],
      })) || [],
    endNotes: [
      {
        label: 'Subtotal:',
        value: `${subtotal(paidOrderDetails?.items)?.toFixed(2)}`,
      },
      {
        label: `Tax (${workBranchVATRate?.toFixed(2)}%)`,
        value: `${getVATAmount(
          paidOrderDetails?.items,
          [],
          workBranchVATRate
        )?.toFixed(2)}`,
      },
      productsTax(paidOrderDetails?.items) > 0 && {
        label: 'Products Tax:',
        value: `${productsTax(paidOrderDetails?.items)?.toFixed(2)}`,
      },
      cashDiscounts() > 0 && {
        label: 'Cash Discounts:',
        value: `- ${cashDiscounts()?.toFixed(2)}`,
      },
      {
        label: 'Total Amount:',
        value: `${paymentData?.total?.toFixed(2) || '0.00'}`,
      },
      isScheduled && {
        label: 'Amount Paid Now:',
        value: `${paymentData?.paymentStatus?.amountPaid?.toFixed(2) || '0.00'}`,
      },
      isScheduled &&
        unpaidBalance > 0 && {
          label: 'Unpaid Balance:',
          value: `${unpaidBalance?.toFixed(2)}`,
        },
    ].filter(Boolean),
    footer: 'Thank you for your purchase! Visit again!',
  });

  const receiptText = (() => {
    const receiptData = getReceiptData();

    const itemsText = receiptData.listOfItems
      .map((item, index) => {
        const optionsText =
          item.options?.length > 0
            ? ` (${item.options.map((option) => option.name).join(', ')})`
            : '';
        return `${index + 1}. ${item.name}${optionsText} x${item.quantity} - ${item.price?.toFixed?.(2) || Number(item.price || 0).toFixed(2)}`;
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
    setIsSendingEmail(true);

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
      setIsSendingEmail(false);
      return;
    }

    showNotification(
      'success',
      'Receipt Sent',
      `Receipt sent to ${paidOrderDetails?.linkedCustomer?.email} successfully`,
      3000
    );
    setIsSendingEmail(false);
    setOpenSendReceipt(false);
    setShowReceipt({ success: false, order: null });
  };

  //TODO: Implement WhatsApp receipt sending functionality in the service and handle response accordingly
  const handleSendWhatsappReceipt = async () => {
    showNotification(
      'success',
      'WhatsApp Receipt sent',
      'Receipt sent via WhatsApp successfully',
      3000
    );

    setOpenSendReceipt(false);
    setShowReceipt({ success: false, order: null });
  };

  const handlePrintReceipt = () => {
    const receiptData = getReceiptData();
    printReceipt(receiptData);
    setShowReceipt({ success: false, order: null });
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
            isSendingEmail={isSendingEmail}
          />
        </div>
      )}
    </>
  );
};

export default SuccessfullPaymentCard;
