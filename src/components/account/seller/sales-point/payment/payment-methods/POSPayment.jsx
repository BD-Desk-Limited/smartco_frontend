import Spinner from '@/components/account/Spinner';
import Image from 'next/image';
import React from 'react';
import { FaCreditCard } from 'react-icons/fa';

const POSPayment = ({
  cart,
  handleActionsToFollowPaymentConfirmation,
  paymentMethod,
  mode,
}) => {
  const [amountDueNow, setAmountDueNow] = React.useState(0);

  const amountPaidBefore = cart?.amountPaid || 0;
  const isScheduled = cart?.payment?.selectedFulfillmentTime === 'scheduled';
  const totalPay = isScheduled
    ? cart?.payment?.partialAmountPaid || 0
    : cart?.payment?.total || 0;

  React.useEffect(() => {
    const payNow = totalPay - amountPaidBefore;
    setAmountDueNow(payNow);
  }, [totalPay, amountPaidBefore]);
  return (
    <div className="h-full w-full">
      {amountPaidBefore > totalPay ? (
        <p className="h-full w-full text-center flex justify-center items-center">
          Please enter a total amount higher than what you already paid. total
          pay cannot be less than what you already paid
        </p>
      ) : (
        <div
          className={`flex flex-col items-start gap-2 w-full h-full relative p-3 ${mode === 'light' ? 'bg-white' : 'bg-gray-800 text-white'} rounded-lg`}
        >
          <h2 className="w-full text-lg flex flex-row items-baseline font-semibold">
            <span className="mr-2">
              {paymentMethod?.icon && <paymentMethod.icon />}
            </span>
            <span>POS Payment</span>
          </h2>
          <div className="w-full h-full text-text-gray flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold">
                Amount Due: {amountDueNow?.toFixed(2)}
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
              Please process the payment using your POS terminal. Once the
              payment is successful, confirm the payment to complete the
              transaction.
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
      )}
    </div>
  );
};

export default POSPayment;
