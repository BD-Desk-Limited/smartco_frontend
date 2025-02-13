import React from 'react';
import Image from 'next/image';

const ErrorModal = ({ message, title, buttonStyle, onClose }) => {
  return (
    <div className="bg-white min-w-[25%] min-h-[40%] rounded-md shadow-md flex flex-col items-center justify-center p-5 gap-5">
      <h1 className="font-semibold">{title}</h1>
      <Image src="/assets/warning.png" alt="error" width={50} height={50} />
      <p className="text-sm">{message}</p>
      <button
        onClick={onClose}
        className={`py-2 px-5 my-2 text-text-white ${buttonStyle} rounded-md shadow-inner`}
      >
        Ok
      </button>
    </div>
  );
};

export default ErrorModal;
