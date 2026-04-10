import React, { use } from 'react';
import BillAndSummary from '../cart/BillAndSummary';
import {
  productsTax,
  itemUnitCost,
  taxfreeProduct,
  subtotal,
} from '../cart/CartBillCalculationFunctions';
import OrderFulfilmentTime from './OrderFulfilmentTime';
import SelectPaymentMethod from './SelectPaymentMethod';
import {
  FaCashRegister,
  FaCreditCard,
  FaMobile,
  FaMoneyBillAlt,
  FaTimes,
} from 'react-icons/fa';
import CashPayment from './payment-methods/CashPayment';
import CardPayment from './payment-methods/CardPayment';
import POSPayment from './payment-methods/POSPayment';
import BankTransfer from './payment-methods/BankTransfer';

const Payment = ({
  cart,
  setCart,
  setShowReceipt,
  setActiveMenuItem,
  handlePendOrder,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  handleCheckout,
  workBranch,
}) => {
  const Now = new Date().toISOString().slice(0, 16);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [paymentType, setPaymentType] = React.useState(
    cart?.payment?.paymentType || null
  );
  const [partialAmountPaid, setPartialAmountPaid] = React.useState(
    cart?.payment?.partialAmountPaid || 0
  );
  const [total, setTotal] = React.useState(cart?.payment?.total || 0);
  const [selectedFulfillmentTime, setSelectedFulfillmentTime] = React.useState(
    cart?.payment?.selectedFulfillmentTime || 'Now'
  );
  const [orderScheduledDateTime, setOrderScheduledDateTime] = React.useState(
    cart?.payment?.orderScheduledDateTime || Now
  );
  const [selectedPaymentPlan, setSelectedPaymentPlan] = React.useState(
    cart?.payment?.selectedPaymentPlan || 'full'
  );
  const [openPaymentMethodOverlay, setOpenPaymentMethodOverlay] =
    React.useState(true);

  const workBranchVATRate =
    workBranch && workBranch.taxBand?.rates[0]?.rate
      ? workBranch.taxBand.rates[0].rate
      : 0;

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // if cart is empty, switch to sales items tab
  React.useEffect(() => {
    const now = new Date().toISOString();
    if (
      !cart?.checkoutInitiatedAt ||
      !cart?.items ||
      cart?.items?.length === 0 ||
      cart?.checkoutInitiatedAt > now
    ) {
      setActiveMenuItem('cart');
    }
  }, [cart?.items, cart?.checkoutInitiatedAt, setActiveMenuItem]);

  //tie payment info to cart, for persistency and sync with order.
  React.useEffect(() => {
    setCart((prevCart) => {
      if (!prevCart) {
        return prevCart;
      }

      const paymentData = {
        paymentType,
        partialAmountPaid,
        selectedFulfillmentTime,
        orderScheduledDateTime,
        selectedPaymentPlan,
        total,
      };

      return {
        ...prevCart,
        payment: paymentData,
      };
    });
  }, [
    paymentType,
    partialAmountPaid,
    selectedFulfillmentTime,
    orderScheduledDateTime,
    selectedPaymentPlan,
    total,
    setCart,
  ]);

  const FulfilmentTimeOptions = [
    { label: 'Now', value: 'Now' },
    { label: 'Schedule for later', value: 'scheduled' },
  ];

  const PaymentPlans = [
    { label: 'Full Advance', value: 'full', amountPaid: total },
    {
      label: 'Partial Payment',
      value: 'partial',
      amountPaid: partialAmountPaid,
    },
    { label: 'No Payment', value: 'none', amountPaid: 0 },
  ];

  const PAYMENT_METHOD_OPTIONS = [
    {
      label: 'Cash',
      value: 'cash',
      icon: () => <FaMoneyBillAlt className="font-bold" />,
      image: '/assets/cash_payment.svg',
      overlay: CashPayment,
      style: {
        overlay: 'border-2 border-brand-green',
        button: 'bg-brand-green text-white',
        spinnerColor: 'brand-green',
      },
    },
    {
      label: 'Card',
      value: 'card',
      icon: () => <FaCreditCard className="font-bold" />,
      image: '/assets/card_payment_method.png',
      overlay: CardPayment,
      style: {
        overlay: 'border-2 border-blue-500',
        button: 'bg-blue-500 text-white',
        spinnerColor: 'blue-500',
      },
    },
    {
      label: 'Bank Transfer',
      value: 'bank_transfer',
      icon: () => <FaMobile className="font-bold" />,
      image: '/assets/bank_payment_method.png',
      overlay: BankTransfer,
      style: {
        overlay: 'border-2 border-yellow-500',
        button: 'bg-yellow-500 text-white',
        spinnerColor: 'yellow-500',
      },
    },
    {
      label: 'P.O.S',
      value: 'pos',
      icon: () => <FaCashRegister className="font-bold" />,
      image:
        'https://www.golomtbank.com/wp-content/uploads/2020/06/V240M-1-1.png',
      overlay: POSPayment,
      style: {
        overlay: 'border-2 border-red-500',
        button: 'bg-red-500 text-white',
        spinnerColor: 'red-500',
      },
    },
  ];

  const SelectedPaymentMethod = PAYMENT_METHOD_OPTIONS?.find(
    (option) => option.value === cart?.payment?.paymentType
  );

  const satisfiedOpenOverlayConditions = () => {
    const validPaymentTypeSelected = PAYMENT_METHOD_OPTIONS.some(
      (option) => option.value === paymentType
    );
    const canNowPay =
      paymentType && validPaymentTypeSelected && openPaymentMethodOverlay;

    if (canNowPay) {
      return true;
    }
    return false;
  };

  const handleClosePaymentMethodOverlay = () => {
    setOpenPaymentMethodOverlay(false);
    setPaymentType(null);
  };

  const handleActionsToFollowPaymentConfirmation = () => {
    // TODO: Implement any additional logic needed after a payment confirmation,
    // sales update
    // updating inventory

    const cartPaidFor = {
      success: true,
      order: {
        ...cart,
        payment: {
          id: 'ID FROM_BACKEND', // TODO: Replace with actual ID from backend after implementing payment processing and order creation logic
          ...cart.payment,
          paymentStatus: {
            ...cart.payment.paymentStatus,
            value: 'success',
            label: 'Payment confirmed...',
            time: new Date().toISOString(),
            amountPaid: partialAmountPaid,
          },
        },
      },
    };

    setShowReceipt(cartPaidFor); // Set the paid order details in state to trigger the display of the receipt with the correct order details after payment confirmation

    // Clear cart after payment confirmation
    setCart({
      items: [],
      linkedCustomer: null,
      payment: null,
    });
  };

  const SHARED_PROPS_FOR_PAYMENT_METHOD_OVERLAYS = {
    handleActionsToFollowPaymentConfirmation,
    cart,
    mode,
    paymentMethod: { ...SelectedPaymentMethod },
  };

  if (!isHydrated || !cart) {
    return null;
  }

  return (
    <div
      className={`flex flex-row justify-between gap-5 w-full h-full relative ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
    >
      {/* Fulfilment time */}
      <OrderFulfilmentTime
        cart={cart}
        setSelectedFulfillmentTime={setSelectedFulfillmentTime}
        setOrderScheduledDateTime={setOrderScheduledDateTime}
        setSelectedPaymentPlan={setSelectedPaymentPlan}
        partialAmountPaid={partialAmountPaid}
        setPartialAmountPaid={setPartialAmountPaid}
        FulfilmentTimeOptions={FulfilmentTimeOptions}
        PaymentPlans={PaymentPlans}
        Now={Now}
        mode={mode}
      />

      {/* Payment method selection */}
      <SelectPaymentMethod
        cart={cart}
        setPaymentType={setPaymentType}
        PAYMENT_METHOD_OPTIONS={PAYMENT_METHOD_OPTIONS}
        setOpenPaymentMethodOverlay={setOpenPaymentMethodOverlay}
        mode={mode}
      />

      {/* Bill summary */}
      <div
        className={`h-full w-1/3 p-2 rounded-lg ${mode === 'light' ? 'bg-background-1' : 'bg-gray-950'}`}
      >
        <BillAndSummary
          linkedCustomerData={cart?.linkedCustomer || null}
          productsTax={productsTax}
          itemUnitCost={itemUnitCost}
          taxfreeProduct={taxfreeProduct}
          workBranchVATRate={workBranchVATRate}
          cartItems={cart?.items || []}
          handlePendOrder={handlePendOrder}
          subtotal={subtotal}
          showButtons={false}
          mode={mode}
          total={total}
          setTotal={setTotal}
          lightThemeStyle={lightThemeStyle}
          darkThemeStyle={darkThemeStyle}
          handleCheckout={handleCheckout}
        />
      </div>

      {/* Payment method selection overlay */}
      {satisfiedOpenOverlayConditions() && (
        <div className="inset-0 absolute w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-10 rounded-lg p-2 ">
          {/* Dynamically render the appropriate payment method overlay based on the selected payment type with shared props */}
          <div
            className={`${SelectedPaymentMethod?.style?.overlay || ''} ${mode === 'light' ? lightThemeStyle : darkThemeStyle} p-2 rounded-lg w-1/2 h-full relative`}
          >
            {SelectedPaymentMethod?.overlay ? (
              <SelectedPaymentMethod.overlay
                {...SHARED_PROPS_FOR_PAYMENT_METHOD_OVERLAYS}
              />
            ) : (
              <p>No payment method selected</p>
            )}
            {/* Close button */}
            <button
              onClick={handleClosePaymentMethodOverlay}
              className="absolute top-0 right-0 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <FaTimes className="inline-block" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
