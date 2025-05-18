import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from './Button';

const DeactivationModal = ({ message, title, buttonStyle, buttonText, onClose, onConfirm, button2Style, deactivationMessages, deactivationErrors, loading }) => {
  return (
    <motion.div 
        className="bg-white w-[30%] h-[55%] rounded-md shadow-md flex flex-col items-center justify-between gap-5"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
    >
      <h1 
        className=" h-[15%] bg-brand-blue text-text-white w-full rounded-t-md text-center flex justify-center items-center"
      >
        {title}
      </h1>
      <div className='bg-gray-shadow10 rounded-[100%] px-3 py-5'>
        <Image src="/assets/switch_inactive.png" alt="error" width={35} height={35} className='border border-gray-border rounded-3xl'/>
      </div>
      {
        (deactivationErrors?.length>0 || deactivationMessages?.length>0) ? (
            <div className='flex flex-col items-center gap-1 max-h-[40%] overflow-y-auto scrollbar-thin w-full px-5'>
                {deactivationErrors.length>0 && 
                    <p className="text-sm text-error flex flex-col items-center text-center">
                        {deactivationErrors.map((error, index) => (
                            <span key={index}>{error}</span>
                        ))}
                    </p>
                }
                <hr className="w-full border border-gray-border" />
                {deactivationMessages && 
                    <p className="text-sm text-success flex flex-col items-center">
                        {deactivationMessages.map((deactivationMessage, index) => (
                            <span key={index}>{deactivationMessage}</span>
                        ))}
                    </p>
                }
                <Button onClick={onClose} buttonStyle={'sticky bottom-0'} text={'Close'}/>
            </div>
        ): (
            <>
                {message&& <p className="text-base text-center px-5 text-text-black">{message}</p>}
                <div className="flex justify-center w-full gap-5">
                  <Button
                    onClick={onConfirm}
                    loading={loading}
                    loadingText={`${buttonText}ing...`}
                    buttonStyle={buttonStyle}
                    text={buttonText}
                  />
                  <Button
                    onClick={onClose}
                    buttonStyle={button2Style}
                    text={'Cancel'}
                  />
                </div>
            </>
        )
      }
      
      <footer className='bg-brand-blue h-[15%] w-full rounded-b-md'></footer>
    </motion.div>
  );
};

export default DeactivationModal;
