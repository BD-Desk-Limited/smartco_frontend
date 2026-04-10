import React from 'react';

const BankTransfer = ({
  handleActionsToFollowPaymentConfirmation,
  mode,
  cart,
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-0 w-full h-full relative p-3 ${mode === 'light' ? 'bg-white' : 'bg-gray-800 text-white'} rounded-lg`}
    >
      <h2 className="w-full font-thin text-lg">Bank Transfer Payment</h2>
      <p className="w-full text-sm text-gray-500 h-full flex items-center justify-center text-center">
        This payment method is currently unavailable. Please choose another
        payment method or contact support for assistance.
      </p>
    </div>
  );
};

export default BankTransfer;
