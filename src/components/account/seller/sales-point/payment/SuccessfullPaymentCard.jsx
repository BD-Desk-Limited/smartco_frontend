import React from 'react';
import {
  getTotalCashOfferDiscount,
  getVATAmount,
  itemTotalCost,
  productsTax,
  subtotal,
} from '../cart/CartBillCalculationFunctions';
import SuccessfulPaymentDisplay from './SuccessfulPaymentDisplay';
import { useAuth } from '@/contexts/authContext';
import printReceipt from '../PrintReceipt';

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
  const { user } = useAuth();
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

  const handleSendReceipt = () => {
    //TODO: Implement receipt generation logic here
    alert('Receipt Sent!');
    setShowReceipt({ success: false, order: null });
  };

  const handlePrintReceipt = () => {
    // construct receipt data
    const receiptData = {
      transactionId: paymentData?.id,
      metaData: {
        title: isScheduled
          ? `Advanced order note for - ${orderDateString(paymentData?.orderScheduledDateTime)}, ${orderTime(paymentData?.orderScheduledDateTime)}`
          : 'Sales Receipt',
        storeName: workBranch?.name || 'Store Name',
        address: workBranch?.address || 'Store Address',
        phone: workBranch?.phone || 'Store Phone',
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

        // items for scheduled orders
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
    };
    printReceipt(receiptData);
    setShowReceipt({ success: false, order: null });
  };

  return (
    <SuccessfulPaymentDisplay
      paymentData={paymentData}
      paidOrderDetails={paidOrderDetails}
      mode={mode}
      lightThemeStyle={lightThemeStyle}
      darkThemeStyle={darkThemeStyle}
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
    />
  );
};

export default SuccessfullPaymentCard;
