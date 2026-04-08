import React, { use } from 'react';
import BillAndSummary from '../cart/BillAndSummary';
import {
  productsTax,
  itemUnitCost,
  taxfreeProduct,
  getTotal,
  subtotal,
} from '../cart/CartBillCalculationFunctions';
import {
  FaCashRegister,
  FaCreditCard,
  FaMobile,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaPaypal,
} from 'react-icons/fa';
import Image from 'next/image';
import CashPayment from './CashPayment';
import CardPayment from './CardPayment';
import BankTransfer from './BankTransfer';
import POSPayment from './POSPayment';

const Payment = ({
  cart,
  setCart,
  setActiveMenuItem,
  handlePendOrder,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  handleCheckout,
  workBranch,
}) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [paymentType, setPaymentType] = React.useState(
    cart?.payment?.paymentType || 'cash'
  );
  const [partialAmountPaid, setPartialAmountPaid] = React.useState(
    cart?.payment?.partialAmountPaid || 0
  );
  const [total, setTotal] = React.useState(cart?.payment?.total || 0);
  const [selectedFulfillmentTime, setSelectedFulfillmentTime] = React.useState(
    cart?.payment?.selectedFulfillmentTime || 'Now'
  );
  const [orderScheduledDateTime, setOrderScheduledDateTime] = React.useState(
    cart?.payment?.orderScheduledDateTime || ''
  );
  const [selectedPaymentPlan, setSelectedPaymentPlan] = React.useState(
    cart?.payment?.selectedPaymentPlan || 'full'
  );

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
    },
    {
      label: 'Card',
      value: 'card',
      icon: () => <FaCreditCard className="font-bold" />,
      image: '/assets/card_payment_method.png',
      overlay: CardPayment,
    },
    {
      label: 'Bank Transfer',
      value: 'bank_transfer',
      icon: () => <FaMobile className="font-bold" />,
      image: '/assets/bank_payment_method.png',
      overlay: BankTransfer,
    },
    {
      label: 'P.O.S',
      value: 'pos',
      icon: () => <FaCashRegister className="font-bold" />,
      image:
        'https://www.golomtbank.com/wp-content/uploads/2020/06/V240M-1-1.png',
      overlay: POSPayment,
    },
  ];

  if (!isHydrated) {
    return null;
  }

  return (
    <div
      className={`flex flex-row justify-between gap-5 w-full h-full relative ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
    >
      {/* Fulfilment time */}
      <div
        className={`h-full w-1/3 p-2 rounded-lg ${mode === 'light' ? 'bg-background-1' : 'bg-gray-950'}`}
      >
        <h2 className="font-semibold mb-4">Select order fulfillment time :</h2>

        {/* fulfillment time options header */}
        <ul className="flex flex-row gap-0 rounded-t-lg mx-3">
          {FulfilmentTimeOptions.map((option) => (
            <li
              key={option.value}
              className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg ${cart?.payment?.selectedFulfillmentTime === option.value ? 'bg-brand-green' : 'border-t border-x'} hover:bg-green-shadow3 transition-colors`}
              onClick={() => setSelectedFulfillmentTime(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>

        {/* fulfillment time options content */}
        <div className="p-2 bg-background-2 rounded-lg border border-brand-green h-auto">
          {cart?.payment?.selectedFulfillmentTime === 'Now' ? (
            <p className="py-10 text-text-gray">
              Order will be fulfilled as soon as possible...
            </p>
          ) : (
            <div>
              <div>
                <p>Select order fulfillment date/time</p>
                <input
                  type="datetime-local"
                  value={cart?.payment?.orderScheduledDateTime}
                  onChange={(e) => setOrderScheduledDateTime(e.target.value)}
                  className={`w-full p-1 border rounded-md mb-2 outline-brand-green ${
                    mode === 'light' ? '' : 'bg-gray-600'
                  }`}
                />
              </div>

              <hr className="my-1 border-gray-300" />
              <ul className="p-2">
                <p>Select a payment plan</p>
                {PaymentPlans.map((plan) => (
                  <li
                    key={plan.value}
                    className={`cursor-pointer p-2 rounded-md ${
                      cart?.payment?.selectedPaymentPlan?.value === plan.value
                        ? 'text-brand-green'
                        : ' text-text-gray'
                    } gap-2 flex items-center`}
                    onClick={() => setSelectedPaymentPlan(plan)}
                  >
                    <input
                      type="checkbox"
                      className="accent-brand-green bg-white"
                      checked={
                        cart?.payment?.selectedPaymentPlan?.value === plan.value
                      }
                      readOnly
                    />
                    {plan.label}
                    {plan.value === 'partial' ? (
                      cart?.payment?.selectedPaymentPlan?.value ===
                        'partial' && (
                        <span className="ml-auto text-sm text-right flex flex-col items-center text-text-gray">
                          <span className="text-right w-full font-semibold">
                            Amount:{' '}
                          </span>
                          <input
                            type="number"
                            className="p-1 px-2 border rounded-md text-text-gray outline-brand-green w-36"
                            value={partialAmountPaid || ''}
                            placeholder="Enter amount to pay"
                            onChange={(e) =>
                              setPartialAmountPaid(Number(e.target.value))
                            }
                          />
                        </span>
                      )
                    ) : (
                      <span className="ml-auto text-sm text-text-gray font-semibold">
                        {`Amount: ${plan.amountPaid?.toFixed(2)}`}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div
        className={`h-full w-1/3 p-2 rounded-lg ${mode === 'light' ? 'bg-background-1' : 'bg-gray-950'}`}
      >
        <h2 className=" font-semibold">Payment</h2>
        <p className="text-sm text-text-gray mb-4">Select payment method</p>
        {/* Payment method options */}
        <div className="flex flex-col max-h-[300px] overflow-y-auto">
          {PAYMENT_METHOD_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={`flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer w-full`}
              onClick={() => setPaymentType(option.value)}
            >
              <input
                type="checkbox"
                className="accent-brand-green bg-white"
                checked={cart?.payment?.paymentType === option.value}
                readOnly
              />
              <div
                className={`flex flex-row items-center gap-2 p-2 w-full rounded-md cursor-pointer ${cart?.payment?.paymentType === option.value ? 'border border-brand-green' : 'border border-gray-300'} hover:bg-green-shadow3 transition-colors`}
              >
                <span>{option.icon && <option.icon />}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{option.label}</span>
                  {option.image && (
                    <Image
                      src={option.image}
                      alt={`icon`}
                      width={20}
                      height={20}
                      className="object-contain h-8 w-fit bg-white rounded-md"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill summary */}
      <div
        className={`relative h-full w-1/3 p-2 rounded-lg ${mode === 'light' ? 'bg-background-1' : 'bg-gray-950'}`}
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

        <button
          onClick={() => alert('Payment processing not implemented yet')}
          className="w-[calc(100%-1rem)] bg-brand-green text-white py-2 px-4 rounded-lg hover:bg-green-shadow1 transition-colors absolute bottom-4 mx-auto"
        >
          Confirm Payment
        </button>
      </div>

      {/* Payment method overlay */}
      {cart?.payment?.paymentType && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg w-1/2">
            {PAYMENT_METHOD_OPTIONS.find(
              (option) => option.value === cart?.payment?.paymentType
            )?.overlay ? (
              React.createElement(
                PAYMENT_METHOD_OPTIONS.find(
                  (option) => option.value === cart?.payment?.paymentType
                ).overlay
              )
            ) : (
              <p>Payment method overlay not implemented yet</p>
            )}
            <button
              onClick={() => setPaymentType('')}
              className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
