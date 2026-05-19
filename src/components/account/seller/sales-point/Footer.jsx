import Image from 'next/image';
import React from 'react';

const Footer = ({ style, mode, setMode }) => {
  return (
    <div
      className={`${style} border-t-2 border-gray-border flex items-center justify-start p-3 flex-row w-full px-10 gap-5`}
    >
      {/* Switch Theme */}
      <div className="flex flex-row justify-center items-center space-x-2 bg-gray-shadow6 rounded-lg p-1">
        {/* Light Mode Icon */}
        <span
          aria-disabled={mode === 'light'}
          onClick={() => setMode('light')}
          className={`p-2 rounded-md ${mode === 'light' ? 'bg-brand-green cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
        >
          <Image
            src={
              mode === 'light'
                ? '/assets/light_mode_active.png'
                : '/assets/light_mode_active.png'
            }
            alt="Light Mode Icon"
            width={20}
            height={20}
            className={`object-contain cursor-pointer ${mode === 'light' ? '' : 'hover:opacity-70'}`}
            onClick={() => setMode('light')}
          />
        </span>

        {/* Vertical Divider */}
        <span
          className={`h-6 border-l-2 ${mode === 'light' ? 'border-white' : 'border-black/50'}`}
        ></span>
        {/* Dark Mode Icon */}
        <span
          aria-disabled={mode === 'dark'}
          onClick={() => setMode('dark')}
          className={`p-2 rounded-md ${mode === 'dark' ? 'bg-brand-green cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
        >
          <Image
            src={
              mode === 'dark'
                ? '/assets/dark_mode_active.png'
                : '/assets/dark_mode_active.png'
            }
            alt="Dark Mode"
            width={20}
            height={20}
            className={`object-contain cursor-pointer ${mode === 'dark' ? '' : 'hover:opacity-70'}`}
            onClick={() => setMode('dark')}
          />
        </span>
      </div>
    </div>
  );
};

export default Footer;
