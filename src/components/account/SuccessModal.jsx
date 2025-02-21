import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const SuccessModal = ({ message, title, buttonStyle, onClose }) => {
  return (
    <motion.div 
        className="bg-white min-w-[25%] h-[40%] rounded-md shadow-md flex flex-col items-center justify-between"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
    >
      <h1 
        className=" min-h-[15%] bg-brand-blue text-text-white w-full rounded-t-md text-center flex justify-center items-center"
      >
        {title}
      </h1>
      <Image src="/assets/verified.png" alt="error" width={50} height={50} />
      <p className="text-base text-success">{message}</p>
      <button
        onClick={onClose}
        className={`py-2 px-5 my-2 text-text-white ${buttonStyle} rounded-md shadow-md`}
      >
        Ok
      </button>
      <footer className='bg-brand-blue min-h-[15%] w-full rounded-b-md'></footer>
    </motion.div>
  );
};

export default SuccessModal;
