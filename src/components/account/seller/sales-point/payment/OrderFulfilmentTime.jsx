import React from 'react';
import PaymentProgress from './PaymentProgress';
import { commaNumberFormat } from '@/utilities/numbersUtils';

// <input type="datetime-local"> works in the till's LOCAL time with no zone ("2026-11-28T10:00").
// Orders keep a full ISO time, so convert both ways instead of slicing the UTC string.
const toLocalInputValue = (value) => {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return '';
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
const fromLocalInputValue = (value) =>
  value ? new Date(value).toISOString() : '';

const OrderFulfilmentTime = ({
  selectedFulfillmentTime,
  setSelectedFulfillmentTime,
  orderScheduledDateTime,
  setOrderScheduledDateTime,
  selectedPaymentPlan,
  setSelectedPaymentPlan,
  partialAmountNow,
  setPartialAmountNow,
  FulfilmentTimeOptions,
  PaymentPlans,
  paymentProgress,
  mode,
}) => {
  const { balanceBefore } = paymentProgress;

  const handleChangeFulfilmentTime = (option) => {
    setSelectedFulfillmentTime(option.value);
    if (option.value === 'Now') {
      setOrderScheduledDateTime(new Date().toISOString());
    }
  };

  const handlePaymentPlanSelection = (plan) => {
    setSelectedPaymentPlan(plan.value);
    if (plan.value !== 'partial') setPartialAmountNow(0);
  };

  const partialTooHigh = Number(partialAmountNow) > balanceBefore;

  return (
    <div
      className={`h-full w-1/3 p-2 rounded-lg overflow-y-auto no-scrollbar ${mode === 'light' ? 'bg-background-1' : 'bg-gray-950'}`}
    >
      <h2 className="font-semibold mb-4">Select order fulfillment time :</h2>
      {/* fulfillment time options header */}
      <ul className="flex flex-row gap-0 rounded-t-lg mx-3">
        {FulfilmentTimeOptions.map((option) => (
          <li
            key={option.value}
            className={`flex-1 text-center py-2 cursor-pointer rounded-t-lg ${selectedFulfillmentTime === option.value ? 'bg-brand-green' : 'border-t border-x'} hover:bg-green-shadow3 transition-colors`}
            onClick={() => handleChangeFulfilmentTime(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>

      {/* fulfillment time options content */}
      <div className="p-2 bg-background-2 rounded-lg border border-brand-green h-auto">
        {selectedFulfillmentTime === 'Now' ? (
          <p className="py-10 text-text-gray">
            Order will be fulfilled as soon as possible. The balance is
            collected now.
          </p>
        ) : (
          <div>
            <div>
              <p>Select order fulfillment date/time</p>
              <input
                type="datetime-local"
                value={toLocalInputValue(orderScheduledDateTime)}
                min={toLocalInputValue(new Date())}
                onChange={(e) =>
                  setOrderScheduledDateTime(fromLocalInputValue(e.target.value))
                }
                className={`w-full p-1 border rounded-md mb-2 outline-brand-green ${
                  mode === 'light' ? '' : 'bg-gray-600'
                }`}
              />
            </div>
            <hr className="my-1 border-gray-300" />
            <ul className="p-2">
              <p>How much is being paid now?</p>
              {PaymentPlans?.map((plan) => (
                <li
                  key={plan.value}
                  className={`cursor-pointer p-2 rounded-md ${
                    selectedPaymentPlan === plan.value
                      ? 'text-brand-green'
                      : ' text-text-gray'
                  } gap-2 flex items-center`}
                  onClick={() => handlePaymentPlanSelection(plan)}
                >
                  <input
                    type="checkbox"
                    className="accent-brand-green bg-white"
                    checked={selectedPaymentPlan === plan.value}
                    readOnly
                  />
                  {plan.label}
                  {plan.value === 'partial' ? (
                    selectedPaymentPlan === 'partial' && (
                      <span className="ml-auto text-sm text-right flex flex-col items-center text-text-gray">
                        <span className="text-right w-full font-semibold">
                          Amount now:{' '}
                        </span>
                        <input
                          type="number"
                          min="0"
                          className="p-1 px-2 border rounded-md text-text-gray outline-brand-green w-36"
                          value={partialAmountNow || ''}
                          placeholder="0.00"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setPartialAmountNow(Number(e.target.value))
                          }
                        />
                        {partialTooHigh && (
                          <span className="text-xs text-red-500 w-36">
                            More than the balance (
                            {commaNumberFormat(balanceBefore, 2)}). Only the
                            balance is collected.
                          </span>
                        )}
                      </span>
                    )
                  ) : (
                    <span className="ml-auto text-sm text-text-gray font-semibold">
                      {`Amount: ${commaNumberFormat(plan.amount, 2)}`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* what has been paid, what is collected now and what is left */}
      <PaymentProgress progress={paymentProgress} mode={mode} />
    </div>
  );
};

export default OrderFulfilmentTime;
