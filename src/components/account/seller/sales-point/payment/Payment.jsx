import React, { useState } from 'react';
import BillAndSummary from '../cart/BillAndSummary';
import {
  productsTax,
  itemUnitCost,
  taxfreeProduct,
  subtotal,
  getVATAmount,
} from '../cart/CartBillCalculationFunctions';
import OrderFulfilmentTime from './OrderFulfilmentTime';
import SelectPaymentMethod from './SelectPaymentMethod';
import { FaTimes } from 'react-icons/fa';
import CashPayment from './payment-methods/CashPayment';
import POSPayment from './payment-methods/POSPayment';
import UnavailablePayment from './payment-methods/UnavailablePayment';
import { OFFERED_METHODS } from '@/utilities/paymentMethods';
import { persistTransactionMultiLayer } from '@/services/transactionPersistenceService';
import { buildRewardSelections } from '../cart/offerHelpers';
import { useAuth } from '@/contexts/authContext';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { PAYMENT_PLAN_LABELS } from './PaymentProgress';

// the screen for each kind of till payment (a method's tillScreen in utilities/paymentMethods.jsx)
const TILL_SCREENS = {
  cash: CashPayment,
  terminal: POSPayment,
  unavailable: UnavailablePayment,
};

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// one id per checkout (letters, digits and dashes, as the server expects)
const newCheckoutId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `co-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

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
  const { user } = useAuth(); // the seller logged in at this till right now
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [paymentType, setPaymentType] = React.useState(
    cart?.payment?.paymentType || null
  );
  // the amount the cashier types for "Pay part now": only what is being collected at this checkout
  const [partialAmountNow, setPartialAmountNow] = React.useState(
    cart?.payment?.partialAmountNow || 0
  );
  const [total, setTotal] = React.useState(cart?.payment?.total || 0);
  const [selectedFulfillmentTime, setSelectedFulfillmentTime] = React.useState(
    cart?.payment?.selectedFulfillmentTime || 'Now'
  );
  // a full ISO time (UTC), so the server reads the moment the cashier picked in local time
  const [orderScheduledDateTime, setOrderScheduledDateTime] = React.useState(
    cart?.payment?.orderScheduledDateTime || new Date().toISOString()
  );
  // what the cashier chose for THIS checkout: 'full' | 'partial' | 'none' (null until chosen)
  const [selectedPaymentPlan, setSelectedPaymentPlan] = React.useState(
    typeof cart?.payment?.selectedPaymentPlan === 'string'
      ? cart.payment.selectedPaymentPlan
      : null
  );
  const [openPaymentMethodOverlay, setOpenPaymentMethodOverlay] =
    React.useState(true);
  const [loading, setLoading] = useState(false);

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

  /*
    Payment progress. The cashier only deals with what is collected NOW, and that is what the server is
    sent (amountPaidNow), under an id for this checkout so a re-sent copy is never recorded twice.
    - paidBefore: paid at earlier checkouts less refunds (set when a scheduled order is moved back to the cart)
    - collectingNow: an order fulfilled now collects the whole balance; a scheduled one what the plan says
    - total: today's price. A scheduled order's price is only fixed when it is fulfilled.
  */
  const paidBefore = round2(cart?.amountPaid || 0);
  const earlierPayments = cart?.payment?.entries || [];
  const earlierRefunds = cart?.payment?.refunds || [];
  const balanceBefore = round2(Math.max(total - paidBefore, 0));
  const isScheduled = selectedFulfillmentTime === 'scheduled';
  const collectingNow = !isScheduled
    ? balanceBefore
    : selectedPaymentPlan === 'full'
      ? balanceBefore
      : selectedPaymentPlan === 'partial'
        ? round2(
            Math.min(Math.max(Number(partialAmountNow) || 0, 0), balanceBefore)
          )
        : 0;
  const paidAfter = round2(paidBefore + collectingNow);
  const balanceAfter = round2(Math.max(total - paidAfter, 0));
  // where the order stands once this checkout is done, as the server stores it
  const paymentPlanAfter =
    paidAfter >= total && total > 0
      ? 'full'
      : paidAfter > 0
        ? 'partial'
        : 'none';
  const nothingToCollect = collectingNow < 0.01;

  //tie payment info to cart, for persistency and sync with order.
  React.useEffect(() => {
    setCart((prevCart) => {
      if (!prevCart) {
        return prevCart;
      }

      const paymentData = {
        paymentType,
        partialAmountNow,
        collectingNow,
        selectedFulfillmentTime,
        orderScheduledDateTime,
        selectedPaymentPlan,
        total,
        // earlier payments and refunds, from the scheduled order (shown, never sent back)
        entries: prevCart.payment?.entries || [],
        refunds: prevCart.payment?.refunds || [],
      };

      return {
        ...prevCart,
        payment: paymentData,
      };
    });
  }, [
    paymentType,
    partialAmountNow,
    collectingNow,
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

  // choices for what is collected at this checkout of a scheduled order
  const PaymentPlans = [
    {
      label: paidBefore > 0 ? 'Pay the balance now' : 'Pay in full now',
      value: 'full',
      amount: balanceBefore,
    },
    { label: 'Pay part now', value: 'partial' },
    { label: 'Pay nothing now', value: 'none', amount: 0 },
  ];

  const paymentProgress = {
    total,
    earlierPayments,
    earlierRefunds,
    paidBefore,
    balanceBefore,
    collectingNow,
    balanceAfter,
  };

  // the payment methods the till offers, from the app's one list (utilities/paymentMethods.jsx)
  const PAYMENT_METHOD_OPTIONS = OFFERED_METHODS.map((method) => ({
    ...method,
    overlay: TILL_SCREENS[method.tillScreen] || UnavailablePayment,
  }));

  const SelectedPaymentMethod = PAYMENT_METHOD_OPTIONS?.find(
    (option) => option.value === cart?.payment?.paymentType
  );

  const satisfiedOpenOverlayConditions = () => {
    const validPaymentTypeSelected = PAYMENT_METHOD_OPTIONS.some(
      (option) => option.value === paymentType
    );
    const canNowPay =
      !nothingToCollect && // nothing due: confirmed from the method column instead
      paymentType &&
      validPaymentTypeSelected &&
      openPaymentMethodOverlay;

    if (canNowPay) {
      return true;
    }
    return false;
  };

  const handleClosePaymentMethodOverlay = () => {
    setOpenPaymentMethodOverlay(false);
    setPaymentType(null);
  };

  const handleActionsToFollowPaymentConfirmation = async () => {
    // when the money at this checkout was taken. Stamped here so a sale synced later (offline) keeps its real time.
    const confirmedAt = new Date().toISOString();

    // The checkout as the server records it. checkoutId is made once here and travels with the sale
    // through every offline retry, so the money is recorded once. No method when nothing was collected.
    const paymentFields = { ...(cart.payment || {}) };
    delete paymentFields.entries; // earlier payments and refunds are the server's; never sent back
    delete paymentFields.refunds;
    const paymentToSubmit = {
      ...paymentFields,
      checkoutId: newCheckoutId(),
      amountPaidNow: collectingNow,
      paymentType: nothingToCollect ? null : paymentType,
      selectedPaymentPlan: paymentPlanAfter,
      paidAt: confirmedAt,
    };

    const successfullyPaidOrderStatus = {
      success: true,
      order: {
        ...cart,
        payment: {
          ...paymentToSubmit,
          selectedPaymentPlan: {
            value: paymentPlanAfter,
            label: PAYMENT_PLAN_LABELS[paymentPlanAfter],
          },
          paymentStatus: {
            value: 'success',
            label: !isScheduled
              ? nothingToCollect && paidBefore > 0
                ? 'Order fulfilled, already paid in full!!!'
                : 'Payment confirmed!!!'
              : !nothingToCollect
                ? `Payment of ${commaNumberFormat(collectingNow, 2)} confirmed for scheduled order!!!`
                : 'Order Scheduled!!!',
            time: confirmedAt,
            paidBefore, // at earlier checkouts
            amountPaidNow: collectingNow, // at this checkout
            amountPaid: paidAfter, // in total so far
          },
        },
      },
    };

    const cashDiscounts =
      cart?.linkedCustomer?.appliedOffers?.filter(
        (offer) => offer.type === 'cash'
      ) || [];

    const cartToSubmit = {
      ...cart,
      linkedCustomer: cart?.linkedCustomer?._id || null,
      orderId: cart?.orderId,
      // WHO made this sale, stamped now. The sale may sync much later (offline), after this seller has logged out
      // and someone else is logged in, so the server must not guess it from whoever syncs.
      seller: user?._id || user?.id,
      branch: workBranch?._id,
      totalAmount: cart?.payment?.total || 0,
      transactionType: 'sale',
      offersApplied:
        cart?.linkedCustomer?.appliedOffers?.map((offer) => offer._id) || [],
      // which free products (and ingredient choices) were handed over for each product reward.
      // Without this the server flags every product reward 'missing_selection' and deducts no stock for it.
      // [{ rewardId, products: [{ productId, selectedOptions: [{ optionId, quantity, optionAdditionalPrice }] }] }]
      rewardSelections: buildRewardSelections(
        cart?.linkedCustomer?.appliedOffers || []
      ),
      payment: paymentToSubmit,
      // the version of a restored scheduled order this checkout was made on; if the order has changed
      // since (fulfilled, cancelled, rescheduled elsewhere), the server changes nothing
      orderRevision: Number.isInteger(cart?.orderRevision)
        ? cart.orderRevision
        : null,
      items:
        cart?.items?.map((item) => {
          const product = item?.product?._id || null;
          const quantity = item?.quantity || 0;
          const price = item?.product?.price || 0;
          const selectedOptions = (
            item?.choices?.map((choiceObj) => {
              if (choiceObj === '') {
                return null; // skip empty choices
              }
              const optionId = choiceObj?.choice?.material?._id || null;
              const optionAdditionalPrice =
                choiceObj?.choice?.additionalPrice || 0;
              const quantity = choiceObj?.choice?.quantity || 0;
              return {
                optionId,
                optionAdditionalPrice,
                quantity,
              };
            }) || []
          ).filter((choice) => choice && choice.optionId !== null); // drop skipped ('' -> null) and empty choices
          return {
            product,
            selectedOptions,
            quantity,
            price,
          };
        }) || [],
      taxDetails: [
        {
          taxType: 'VAT',
          taxAmount: getVATAmount(
            cart?.items,
            cashDiscounts,
            workBranchVATRate
          ),
        },
        { taxType: 'Product Tax', taxAmount: productsTax(cart?.items) },
      ],
      orderCompletedAt: confirmedAt,
    };

    try {
      setLoading(true);
      /*
      // MULTI-LAYER PERSISTENCE: Ensures transaction is saved across all available storage layers
      // Layer 1: IndexedDB (primary, offline first)
      // Layer 2: API with retry (backend, falls back to IDB if API fails)
      // Layer 3: Encrypted localStorage (final fallback. only if API and IDB both fail, to avoid data loss)
      // Layer 4: Background sync on reconnection (recovers localStorage backup to API when connectivity is restored, and retries any failed sync attempts, ensuring data eventually reaches backend even if all layers fail at the moment of transaction creation)
      */

      const persistSalesResult =
        await persistTransactionMultiLayer(cartToSubmit);

      if (!persistSalesResult?.success) {
        console.error(
          'Transaction persistence failed on all layers:',
          persistSalesResult ?? {
            success: false,
            message: 'No persistence result returned',
          }
        );
        // Even if persistence fails, allow user to see receipt since payment was confirmed
        // but show persistent message that data needs to be saved
      }

      // Include persistence status in receipt for user feedback
      const persistenceStatus = {
        trackingId: persistSalesResult?.trackingId || null,
        persistedTo: persistSalesResult?.persistedTo || [],
        userMessage:
          persistSalesResult?.userMessage ||
          'Unable to determine persistence status.',
        hasSynced: persistSalesResult?.persistedTo?.includes('API'),
      };

      // Update the order status with persistence results to show in receipt and token for customer registration if needed
      successfullyPaidOrderStatus.order.persistenceStatus = persistenceStatus;
      successfullyPaidOrderStatus.customerRegToken =
        persistSalesResult?.customerRegToken || null;

      setShowReceipt(successfullyPaidOrderStatus); // Set the paid order details in state to trigger the display of the receipt with the correct order details after payment confirmation

      // Clear cart after payment confirmation
      setCart({
        items: [],
        linkedCustomer: null,
        payment: null,
      });
    } catch (err) {
      console.error('Error in payment confirmation handler:', err);
      // Even on error, proceed to show receipt - payment was confirmed in payment gateway
      // Persistence errors should not block user experience at this point
      setShowReceipt(successfullyPaidOrderStatus);
    } finally {
      setLoading(false);
    }
  };

  const SHARED_PROPS_FOR_PAYMENT_METHOD_OVERLAYS = {
    handleActionsToFollowPaymentConfirmation,
    cart,
    mode,
    paymentMethod: { ...SelectedPaymentMethod },
    loading,
    amountDueNow: collectingNow, // what to collect at this checkout, nothing more
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
        selectedFulfillmentTime={selectedFulfillmentTime}
        setSelectedFulfillmentTime={setSelectedFulfillmentTime}
        orderScheduledDateTime={orderScheduledDateTime}
        setOrderScheduledDateTime={setOrderScheduledDateTime}
        selectedPaymentPlan={selectedPaymentPlan}
        setSelectedPaymentPlan={setSelectedPaymentPlan}
        partialAmountNow={partialAmountNow}
        setPartialAmountNow={setPartialAmountNow}
        FulfilmentTimeOptions={FulfilmentTimeOptions}
        PaymentPlans={PaymentPlans}
        paymentProgress={paymentProgress}
        mode={mode}
      />

      {/* Payment method selection */}
      <SelectPaymentMethod
        cart={cart}
        setPaymentType={setPaymentType}
        PAYMENT_METHOD_OPTIONS={PAYMENT_METHOD_OPTIONS}
        setOpenPaymentMethodOverlay={setOpenPaymentMethodOverlay}
        mode={mode}
        isScheduled={isScheduled}
        selectedPaymentPlan={selectedPaymentPlan}
        nothingToCollect={nothingToCollect}
        paidBefore={paidBefore}
        onConfirmWithoutPayment={handleActionsToFollowPaymentConfirmation}
        loading={loading}
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
