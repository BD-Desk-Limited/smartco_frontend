import React from 'react';
import Image from 'next/image';
import { useNotification } from '@/contexts/notificationContext';

const SelectPaymentMethod = ({
  cart,
  setPaymentType,
  PAYMENT_METHOD_OPTIONS,
  setOpenPaymentMethodOverlay,
  mode,
  isScheduled,
  selectedPaymentPlan,
  nothingToCollect,
  paidBefore,
  onConfirmWithoutPayment,
  loading,
}) => {
  const { showNotification } = useNotification();
  const planMissing = isScheduled && !selectedPaymentPlan;

  const handlePaymentMethodClick = (option) => {
    // a scheduled order needs to know how much is paid now before a method is chosen
    if (planMissing) {
      showNotification(
        'error',
        'Payment plan not selected',
        'Please choose how much is being paid now before choosing a payment method.',
        4000
      );
      return;
    }
    setPaymentType(option.value);
    setOpenPaymentMethodOverlay(true);
  };

  return (
    <div
      className={`h-full w-1/3 p-2 rounded-lg ${mode === 'light' ? 'bg-background-1' : 'bg-gray-950'}`}
    >
      <h2 className=" font-semibold">Payment</h2>
      {!planMissing && nothingToCollect ? (
        // nothing is collected at this checkout, so no method is needed
        <div className="flex flex-col gap-3 mt-4 text-sm text-text-gray">
          <p>
            {isScheduled
              ? 'Nothing is collected now. The order is scheduled with its balance still to pay.'
              : paidBefore > 0
                ? 'This order is already paid in full. Nothing to collect.'
                : 'Nothing to collect for this order.'}
          </p>
          <button
            onClick={onConfirmWithoutPayment}
            disabled={loading}
            className={`bg-brand-green text-white px-4 py-2 w-full rounded hover:bg-opacity-90 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isScheduled ? 'Confirm schedule' : 'Confirm order'}
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-gray mb-4">
            {planMissing
              ? 'Choose how much is being paid now first'
              : 'Select payment method'}
          </p>
          {/* Payment method options */}
          {PAYMENT_METHOD_OPTIONS?.length > 0 ? (
            <div className="flex flex-col max-h-[300px] overflow-y-auto">
              {PAYMENT_METHOD_OPTIONS?.map((option) => (
                <div
                  key={option.value}
                  className={`flex flex-row items-center gap-2 p-2 rounded-md cursor-pointer w-full`}
                  onClick={() => handlePaymentMethodClick(option)}
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
          ) : (
            <p className="w-full h-full flex items-center text-center text-error">
              No payment method to choose from at the moment!!!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SelectPaymentMethod;
