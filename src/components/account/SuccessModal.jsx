import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SuccessModal = ({ message, title, buttonStyle, onClose, subText, buttonText }) => {
  return (
    <motion.div 
        className="bg-white w-[25%] h-[45%] rounded-md shadow-md flex flex-col items-center justify-between"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
    >
      <h1 
        className=" h-[15%] bg-brand-blue text-text-white w-full rounded-t-md text-center flex justify-center items-center"
      >
        {title}
      </h1>
      <Image src="/assets/verified.png" alt="error" width={50} height={50} />
      {message&& <p className="text-base text-center text-success">{message}</p>}
      {subText&& <span className="text-sm text-center px-5 text-text-gray">{subText}</span>}
      <button
        onClick={onClose}
        className={`py-2 px-5 my-2 text-text-white ${buttonStyle} rounded-md shadow-md`}
      >
        {buttonText || 'OK'}
      </button>
      <footer className='bg-brand-blue h-[15%] w-full rounded-b-md'></footer>
    </motion.div>
  );
};

export default SuccessModal;
