import Spinner from '@/components/account/Spinner';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import Image from 'next/image';
import React from 'react';

const POSPayment = ({
  handleActionsToFollowPaymentConfirmation,
  paymentMethod,
  mode,
  loading,
  amountDueNow = 0, // what to collect at this checkout (worked out on the payment page)
}) => {
  return (
    <div className="h-full w-full">
      {loading ? (
        <Spinner color="red-500" />
      ) : (
        <>
          <div
            className={`flex flex-col items-start gap-2 w-full h-full relative p-3 ${mode === 'light' ? 'bg-white' : 'bg-gray-800 text-white'} rounded-lg`}
          >
            <h2 className="w-full text-lg flex flex-row items-baseline font-semibold">
              <span className="mr-2">
                {paymentMethod?.icon && <paymentMethod.icon />}
              </span>
              <span>{paymentMethod?.label} Payment</span>
            </h2>
            <div className="w-full h-full text-text-gray flex flex-col justify-center items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="font-semibold">
                  Amount Due: {commaNumberFormat(amountDueNow, 2)}
                </span>
                <span className="font-semibold">{paymentMethod.label}</span>
                {paymentMethod.image && (
                  <Image
                    src={paymentMethod.image}
                    alt={`icon`}
                    width={20}
                    height={20}
                    className="object-contain h-8 w-fit bg-white rounded-md"
                  />
                )}
              </div>
              <p className="text-center">
                Please take the payment on the terminal or device used for it.
                Once the payment is successful, confirm the payment to complete
                the transaction.
              </p>

              <Spinner
                size={10}
                spaceHeight="3rem"
                color={paymentMethod?.style?.spinnerColor || ''}
              />
            </div>

            <button
              onClick={handleActionsToFollowPaymentConfirmation}
              className={`${paymentMethod?.style?.button || ''} px-4 py-2 w-full rounded hover:bg-opacity-90 transition`}
            >
              Confirm Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default POSPayment;
