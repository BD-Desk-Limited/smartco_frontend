import Image from 'next/image';
import React from 'react';
import { useAuth } from '@/contexts/authContext';

const Footer = ({ style }) => {
  const { logOutSalesPoint } = useAuth();
  return (
    <div
      className={`${style} border-t-2 border-border-gray flex items-center justify-between p-3 flex-row w-full px-10`}
    >
      <div className="bg-">
        <span></span>
        <span></span>
      </div>
      <div className="flex flex-row justify-center items-center font-semibold text-error hover:bg-error/10 px-4 py-1 rounded-md cursor-pointer space-x-2">
        <Image
          src="/assets/logout_pos.png"
          alt="Logout Icon"
          width={30}
          height={30}
          className="object-contain"
        />
        <span onClick={logOutSalesPoint} className="cursor-pointer">
          Logout
        </span>
      </div>
    </div>
  );
};

export default Footer;
