import React from 'react';
import Button from './Button';
import Image from 'next/image';
import { motion } from 'framer-motion';

const WarningModal = ({ message, title, button1Style,button2Style, button1Text, button2Text, onClick, onClose, subText, loadingText, imageSrc, loading}) => {
    return (
      <motion.div 
          className="bg-white w-[25%] h-[45%] rounded-md shadow-md flex flex-col items-center justify-between"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
      >
        <h1 
          className=" h-[15%] bg-brand-blue text-text-white w-full rounded-t-md text-center flex justify-center items-center"
        >
          {title}
        </h1>
        <div className='flex flex-col items-center justify-center h-[70%] gap-5 px-5'>
          <Image src={imageSrc} alt="" width={50} height={50} />
          {message&& <p className="text-base text-center text-error">{message}</p>}
          {subText&& <span className="text-sm text-center text-text-gray px-5">{subText}</span>}

          <div className='flex flex-row gap-5 w-full justify-center items-center'>
            <Button 
              onClick={onClick}
              buttonStyle={`py-2 px-5 my-2 ${button1Style} rounded-md shadow-md`}
              text={button1Text}
              loadingText={loadingText}
              loading={loading}
            />

            <Button 
              onClick={onClose}
              buttonStyle={`py-2 px-5 my-2 ${button2Style} rounded-md shadow-md`}
              text={button2Text}
            />
          </div>
        </div>
        <footer className='bg-brand-blue h-[15%] w-full rounded-b-md'></footer>
      </motion.div>
    );
  };

export default WarningModal;