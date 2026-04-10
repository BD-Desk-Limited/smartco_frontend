import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { FaEnvelope, FaPaperPlane, FaPrint, FaWhatsapp } from 'react-icons/fa';

const SuccessfullPaymentCard = ({
  paymentData,
  paidOrderDetails,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  showReceipt,
  setShowReceipt,
}) => {
  const orderDate = new Date(paymentData?.orderScheduledDateTime);
  // Format the time to 12-hour format with AM/PM
  const orderTime = orderDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    formatMatcher: 'basic',
  });
  const orderDateString = orderDate.toLocaleDateString();

  const unpaidBalance =
    paymentData?.total - paymentData?.paymentStatus?.amountPaid;

  const isScheduled =
    paymentData?.selectedFulfillmentTime === 'Now' ? false : true;

  return (
    <div
      className={`flex flex-row justify-center items-center gap-1 w-[640px] h-[90vh] p-3 rounded-lg ${mode === 'light' ? lightThemeStyle : darkThemeStyle} p-5 rounded-lg`}
    >
      <div
        className={`flex flex-col justify-between items-start gap-0 w-2/3 h-full`}
      >
        <h2 className="text-xl font-thin">
          {isScheduled ? 'Order Schedule Details' : 'Payment Details'}
        </h2>

        <div className="flex items-center justify-center gap-1 flex-col w-full my-5">
          <motion.h1
            className="text-5xl font-bold flex items-center justify-center w-full animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={'/assets/verified.png'}
              alt=""
              width={100}
              height={100}
            />
          </motion.h1>
          <div className="text-center text-sm text-success font-semibold ">
            Payment Confirmed!!!
          </div>
        </div>

        <div className="font-mono">
          {isScheduled ? (
            <p className="flex flex-col">
              <span>
                <strong>Payment Plan: </strong>
                {`${paymentData?.selectedPaymentPlan?.label} (${paymentData?.paymentType})`}
              </span>
              <span>
                <strong>Amount paid: </strong>
                {paymentData?.paymentStatus?.amountPaid?.toFixed(2)}
              </span>
              {unpaidBalance > 0 && (
                <span className="">
                  <strong>Unpaid Balance: </strong>
                  {unpaidBalance.toFixed(2)}
                </span>
              )}

              <span className="font-semibold">
                Scheduled for: {orderDateString} at {orderTime}
              </span>
            </p>
          ) : (
            <p className="flex flex-col">
              <span>
                <strong>Payment Method: </strong>
                {paymentData?.paymentType}
              </span>
            </p>
          )}
          <p>
            <strong>Total Amount: </strong>
            {paymentData?.total?.toFixed(2)}
          </p>
        </div>

        {/*Action buttons*/}
        <div className="flex flex-col items-center justify-center gap-2 w-full my-5">
          <button
            className={`px-2 py-2 rounded-md border-2 transition-colors w-full hover:border-green-600`}
            onClick={() => {
              //TODO: Implement receipt generation logic here
              alert('Receipt printed!');
              setShowReceipt({ success: false, order: null });
            }}
          >
            <FaPrint className="inline-block mr-2" />
            {isScheduled ? 'Print Advance Order notice' : 'Print Receipt'}
          </button>
          {/* Send soft copy Receipt */}
          {showReceipt?.order?.linkedCustomer !== null && (
            <button
              className={`px-2 py-2 rounded-md border-2 transition-colors w-full hover:border-green-600`}
              onClick={() => {
                //TODO: Implement receipt generation logic here
                alert('Receipt Sent!');
                setShowReceipt({ success: false, order: null });
              }}
            >
              <FaPaperPlane className="inline-block mr-2" />
              {isScheduled ? 'Send Advance Order notice' : 'Send Receipt'}
              <FaWhatsapp className="inline-block ml-2 text-green-500" />
              <FaEnvelope className="inline-block ml-2 text-blue-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-col py-2 w-full my-5 border rounded-lg h-full">
        <h3 className=" font-semibold">
          Order Details (
          {(paidOrderDetails?.items?.length || 0) > 1
            ? `${paidOrderDetails?.items?.length} items`
            : `${paidOrderDetails?.items?.length} item`}
          )
        </h3>
        <span className="text-text-gray text-xs">{paymentData?.id}</span>
        <div className="flex flex-col gap-1 w-full h-full p-2 overflow-y-auto">
          {paidOrderDetails?.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between w-full p-2 rounded-md bg-gray-200"
            >
              kglugl
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessfullPaymentCard;
