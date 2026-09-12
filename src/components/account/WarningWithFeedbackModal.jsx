import React from 'react';
import {
  FaExclamationTriangle,
  FaExclamation,
  FaTimes,
  FaCheckCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from './Button';

const WarningWithFeedbackModal = ({
  warningMessage,
  subText,
  title,
  buttonStyle,
  onClose,
  onConfirm,
  onOKClick,
  button2Style,
  responseMessages,
  responseErrors,
  loading,
  confirmationText,
  cancelText,
}) => {
  const onOK = () => {
    onOKClick && typeof onOKClick === 'function'
      ? onOKClick()
      : window.location.reload();
  };

  // validate the presense of response messages and errors to ensure they are not empty, undefined, or null
  const validSuccessMessages = responseMessages?.every(
    (message) =>
      message &&
      message.trim() !== '' &&
      message !== 'undefined' &&
      message !== 'null'
  );

  const validErrorMessages = responseErrors?.every(
    (message) =>
      message &&
      message.trim() !== '' &&
      message !== 'undefined' &&
      message !== 'null'
  );

  return (
    <motion.div
      className="bg-white w-[30%] h-[55%] rounded-md shadow-md flex flex-col items-center justify-between gap-5"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className=" h-[15%] bg-brand-blue text-text-white w-full rounded-t-md text-center flex justify-center items-center">
        {title}
      </h1>
      {/* Exclamation Triangle */}
      <>
        {!validSuccessMessages && !validErrorMessages && (
          <FaExclamationTriangle className="text-4xl text-error" />
        )}
      </>

      {/* Display warning message if no response messages or error already exist */}
      {validSuccessMessages || validErrorMessages ? (
        <div className="flex flex-col items-center gap-1 max-h-[40%] overflow-y-auto scrollbar-thin w-full px-5">
          {responseErrors?.length > 0 && validErrorMessages && (
            <div className="flex flex-col items-center gap-3">
              <FaTimes className="text-3xl text-error" />
              <p className="text-sm text-error flex flex-col items-center text-center">
                {responseErrors?.map((errorMessage, index) => (
                  <span key={index}>{errorMessage}</span>
                ))}
              </p>
              <Button
                onClick={onClose}
                buttonStyle={
                  'sticky bottom-0 bg-error hover:bg-error-hover text-white '
                }
                text={'Close'}
              />
            </div>
          )}

          <hr className="w-full border border-gray-border" />

          {responseMessages?.length > 0 && validSuccessMessages && (
            <>
              <FaCheckCircle className="text-4xl text-success animate-pulse" />
              <p className="text-base text-success flex flex-col items-center my-5">
                {responseMessages?.map((responseMessage, index) => (
                  <span key={index}>{responseMessage}</span>
                ))}
              </p>
              <Button
                onClick={onOK}
                buttonStyle={
                  'sticky bottom-0 bg-success hover:bg-green-shadow2 text-white text-center'
                }
                text={'OK'}
              />
            </>
          )}
        </div>
      ) : (
        <>
          {warningMessage && (
            <p className="text-base text-center px-5 text-error">
              {warningMessage}
            </p>
          )}
          {subText && (
            <span className="text-sm text-center text-text-gray px-5">
              {subText}
            </span>
          )}
          <div className="flex justify-center w-full gap-5">
            <Button
              onClick={onConfirm}
              buttonStyle={buttonStyle}
              text={confirmationText}
              loading={loading}
            />
            <Button
              onClick={onClose}
              buttonStyle={button2Style}
              text={cancelText || 'Back'}
              loading={loading}
            />
          </div>
        </>
      )}

      <footer className="bg-brand-blue h-[15%] w-full rounded-b-md"></footer>
    </motion.div>
  );
};

export default WarningWithFeedbackModal;
