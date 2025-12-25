import Image from 'next/image';
import React from 'react';

const Footer = ({ mode, setMode, darkThemeStyle, lightThemeStyle }) => {
  return (
    <div
      className={`${mode === 'light' ? lightThemeStyle : darkThemeStyle} border-t-2 border-border-gray flex items-center justify-between p-3 flex-row w-full px-10`}
    >
      <div className="bg-">
        <span></span>
        <span></span>
      </div>
      <div className="flex flex-row justify-center items-center font-semibold text-error">
        <Image
          src="/assets/logout_pos.png"
          alt="Logout Icon"
          width={30}
          height={30}
          className="object-contain"
        />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Footer;
