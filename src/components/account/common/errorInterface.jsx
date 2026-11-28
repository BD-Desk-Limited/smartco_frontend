import React from 'react';
import Image from 'next/image';

const ErrorInterface = ({ error }) => {
  return (
    <span className="text-error w-full text-center text-base items-center flex justify-center gap-2">
      <Image src={'/assets/error.png'} alt="errorr" width={20} height={20} />
      <span>{error}</span>
    </span>
  );
};

export default ErrorInterface;
