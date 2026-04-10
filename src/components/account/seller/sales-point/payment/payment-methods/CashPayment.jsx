import Image from 'next/image';
import React from 'react';
import NumberPad from '../../NumberPad';

const CashPayment = ({
  handleActionsToFollowPaymentConfirmation,
  paymentMethod,
  mode,
  cart,
}) => {
  const [amountReceived, setAmountReceived] = React.useState('');
  const parsedAmountReceived = parseFloat(amountReceived || '0');
  const change = parsedAmountReceived - cart?.payment?.total;

  const handleNumberInput = (e) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmountReceived(value);
    } else {
      return; // Ignore invalid input
    }
  };

  return (
    <div
      className={`flex flex-col items-start gap-2 w-full h-full relative p-3 ${mode === 'light' ? 'bg-white' : 'bg-gray-800 text-white'} rounded-lg`}
    >
      <h2 className="w-full text-lg flex flex-row items-baseline font-semibold">
        <span className="mr-2">
          {paymentMethod?.icon && <paymentMethod.icon />}
        </span>
        <span>Cash Payment</span>
      </h2>
      <div className="h-full w-full flex flex-row">
        <div className="w-1/2 h-full text-text-gray flex flex-col justify-center items-center">
          <div className="flex items-center gap-2">
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
            Cash Amount:
            <span className="font-semibold ml-1">
              {cart?.payment?.total?.toFixed(2)}
            </span>
            .
          </p>

          {/* Allow user to input the amount received and calculate change */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <p>Enter Amount Received:</p>
            <input
              type="text"
              inputMode="decimal"
              value={amountReceived}
              onChange={(e) => handleNumberInput(e)}
              placeholder="Amount Received"
              className={`px-3 py-2 rounded-md border-2 w-full text-center border-brand-green focus:outline-none focus:ring-2 focus:brand-green transition`}
            />
            <div className="text-green-600 font-semibold">
              Change to return:{' '}
              {Number.isFinite(change) && change >= 0
                ? change.toFixed(2)
                : '0.00'}
            </div>
          </div>
        </div>

        {/* OnScreen number pad for Amount Input */}
        <div className="w-1/2 h-full flex flex-col justify-center items-center">
          <NumberPad
            value={amountReceived}
            assignValueFunction={setAmountReceived}
          />
        </div>
      </div>

      <button
        onClick={handleActionsToFollowPaymentConfirmation}
        className={`${paymentMethod?.style?.button || ''} px-4 py-2 w-full rounded hover:bg-opacity-90 transition`}
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default CashPayment;
