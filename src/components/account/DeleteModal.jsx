import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from './Button';

const DeleteModal = ({ message, title, buttonStyle, onClose, onConfirm, button2Style, deleteMessages, deleteErrors, loading }) => {
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
      <Image src="/assets/delete-warning.png" alt="error" width={70} height={70} />
      {
        (deleteErrors && deleteErrors.length > 0 || deleteMessages && deleteMessages.length > 0) ? (
            <div className='flex flex-col items-center gap-1 max-h-[40%] overflow-y-auto scrollbar-thin w-full px-5'>
                {deleteErrors.length>0 && 
                    <p className="text-sm text-error flex flex-col items-center text-center">
                        {deleteErrors.map((error, index) => (
                            <span key={index}>{error}</span>
                        ))}
                    </p>
                }
                <hr className="w-full border border-gray-border" />
                {deleteMessages && 
                    <p className="text-sm text-success flex flex-col items-center">
                        {deleteMessages.map((deleteMessage, index) => (
                            <span key={index}>{deleteMessage}</span>
                        ))}
                    </p>
                }
                <Button onClick={onClose} buttonStyle={'sticky bottom-0'} text={'Close'}/>
            </div>
        ): (
            <>
                {message&& <p className="text-base text-center px-5 text-error">{message}</p>}
                <div className="flex justify-center w-full gap-5">
                  <Button
                    onClick={onConfirm}
                    loading={loading}
                    loadingText={'Deleting...'}
                    buttonStyle={buttonStyle}
                    text={'Delete'}
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

export default DeleteModal;
