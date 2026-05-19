import React from 'react';

const OrderFulfilmentTime = ({
  cart,
  setSelectedFulfillmentTime,
  setOrderScheduledDateTime,
  setSelectedPaymentPlan,
  partialAmountPaid,
  setPartialAmountPaid,
  FulfilmentTimeOptions,
  PaymentPlans,
  Now,
  mode,
}) => {
  const handleChangeFulfilmentTime = (option) => {
    setSelectedFulfillmentTime(option.value);
    if (option.value === 'Now') {
      setOrderScheduledDateTime(Now);
      setSelectedPaymentPlan({
        value: 'full',
        label: 'Full payment',
        amountPaid: cart?.payment?.total || 0,
      });
      setPartialAmountPaid(cart?.payment?.total || 0);
    }
  };

  const handlePaymentPlanSelection = (plan) => {
    setSelectedPaymentPlan(plan);
    setPartialAmountPaid(plan.amountPaid);
  };

  return (
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
            onClick={() => handleChangeFulfilmentTime(option)}
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
                value={
                  cart?.payment?.orderScheduledDateTime?.slice(0, 16) || Now
                }
                onChange={(e) => setOrderScheduledDateTime(e.target.value)}
                className={`w-full p-1 border rounded-md mb-2 outline-brand-green ${
                  mode === 'light' ? '' : 'bg-gray-600'
                }`}
              />
            </div>
            <hr className="my-1 border-gray-300" />
            <ul className="p-2">
              <p>Select a payment plan</p>
              {PaymentPlans?.map((plan) => (
                <li
                  key={plan.value}
                  className={`cursor-pointer p-2 rounded-md ${
                    cart?.payment?.selectedPaymentPlan?.value === plan.value
                      ? 'text-brand-green'
                      : ' text-text-gray'
                  } gap-2 flex items-center`}
                  onClick={() => handlePaymentPlanSelection(plan)}
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
                    cart?.payment?.selectedPaymentPlan?.value === 'partial' && (
                      <span className="ml-auto text-sm text-right flex flex-col items-center text-text-gray">
                        <span className="text-right w-full font-semibold">
                          Amount:{' '}
                        </span>
                        <input
                          type="number"
                          className="p-1 px-2 border rounded-md text-text-gray outline-brand-green w-36"
                          value={partialAmountPaid || ' 0.00'}
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
  );
};

export default OrderFulfilmentTime;
