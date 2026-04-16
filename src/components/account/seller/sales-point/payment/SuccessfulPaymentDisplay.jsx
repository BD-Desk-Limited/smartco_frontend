import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import {
  FaEnvelope,
  FaGift,
  FaPaperPlane,
  FaPrint,
  FaShoppingBag,
  FaWhatsapp,
} from 'react-icons/fa';
import {
  getVATAmount,
  itemTotalCost,
  itemUnitCost,
  productItemTax,
  productsTax,
  subtotal,
  taxfreeProduct,
} from '../cart/CartBillCalculationFunctions';

const SuccessfulPaymentDisplay = ({
  paymentData,
  paidOrderDetails,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  showReceipt,
  handlePrintReceipt,
  handleSendReceipt,
  isScheduled,
  unpaidBalance,
  orderDateString,
  orderTime,
  cashDiscounts,
  productOffers,
  workBranchVATRate,
}) => {
  return (
    <div
      className={`flex flex-row justify-center items-center gap-1 w-[640px] h-[90vh] p-3 rounded-lg ${mode === 'light' ? lightThemeStyle : darkThemeStyle} p-5 rounded-lg`}
    >
      {/* Payment confirmation and details section */}
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
            {paymentData?.paymentStatus?.label || 'Payment confirmed!!!'}
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
                Scheduled for:{' '}
                {orderDateString(paymentData?.orderScheduledDateTime)} at{' '}
                {orderTime(paymentData?.orderScheduledDateTime)}
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
            onClick={handlePrintReceipt}
          >
            <FaPrint className="inline-block mr-2" />
            {isScheduled ? 'Print Advance Order notice' : 'Print Receipt'}
          </button>
          {/* Send soft copy Receipt */}
          {showReceipt?.order?.linkedCustomer !== null && (
            <button
              className={`px-2 py-2 rounded-md border-2 transition-colors w-full hover:border-green-600`}
              onClick={handleSendReceipt}
            >
              <FaPaperPlane className="inline-block mr-2" />
              {isScheduled ? 'Send Advance Order notice' : 'Send Receipt'}
              <FaWhatsapp className="inline-block ml-2 text-green-500" />
              <FaEnvelope className="inline-block ml-2 text-blue-500" />
            </button>
          )}
        </div>
      </div>

      {/* Order details section */}
      <div className="flex gap-1 flex-col justify-between p-1 w-full border rounded-lg h-full">
        {/* Order details header and product list */}
        <div className="flex flex-col gap-2 w-full h-auto max-h-[80%]">
          <div className="flex flex-col gap-1 w-full items-center">
            <h3 className=" font-semibold">
              Order Details (
              {(paidOrderDetails?.items?.length || 0) > 1
                ? `${paidOrderDetails?.items?.length} items`
                : `${paidOrderDetails?.items?.length} item`}
              )
            </h3>
            <span className="text-text-gray text-xs">{paymentData?.id}</span>

            <p className="text-text-gray text-sm w-full text-left">
              <span className="font-semibold">Date: </span>
              {orderDateString(paymentData?.paymentStatus?.time)}
              {', '}
              {orderTime(paymentData?.paymentStatus?.time)}
            </p>
          </div>

          {/* List of cart items */}
          <div className="flex flex-col gap-1 w-full overflow-y-auto scrollbar-thin ">
            {paidOrderDetails?.items?.map((item) => (
              <div
                key={item.cartItemId}
                className={`border-y rounded-sm flex items-center gap-1 px-1 ${mode === 'light' ? 'bg-gray-shadow10' : 'bg-gray-shadow1'}`}
              >
                <div className="flex items-center gap-4">
                  {item.product?.imageURL ? (
                    <Image
                      src={item.product?.imageURL}
                      alt={item.product?.name || 'item Image'}
                      width={30}
                      height={30}
                      className="w-9 h-9 object-cover rounded shadow-sm"
                    />
                  ) : (
                    <FaShoppingBag
                      className={`w-9 h-9 text-gray-500 ${mode === 'light' ? 'bg-gray-shadow7' : 'bg-gray-shadow8'} rounded`}
                    />
                  )}
                </div>

                <div className="flex-1 flex-col items-start gap-1">
                  <p className="text-base">{item.product?.name}</p>
                  {/* choices display until width is exhausted */}
                  <p className="text-sm font-thin text-text-gray truncate max-w-[250px]">
                    {(Array.isArray(item?.choices) ? item.choices : [])
                      .map((obj) => obj.choice?.material?.name)
                      .join(', ')
                      .slice(0, 40)}
                  </p>
                </div>

                {/* Quantity and price details */}
                <div className="flex flex-col items-center gap-1">
                  <p className="font-bold text-sm">
                    {item?.product?.currency}
                    {itemTotalCost(item)?.toFixed(2)}
                  </p>
                  <p className="text-xs text-text-gray">
                    {item.quantity} x {item?.product?.currency}
                    {itemUnitCost(item)?.toFixed(2)}
                  </p>
                  {productItemTax(item) > 0 && !taxfreeProduct(item) && (
                    <p className="text-xs text-text-gray">
                      tax: {` `}
                      {item.quantity} x {item?.product?.currency}
                      {productItemTax(item)?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {/* Display applied product offers */}
            {productOffers()?.length > 0 && (
              <div className="flex flex-col sticky bottom-0">
                {productOffers()?.map((offer, index) => (
                  <div
                    key={index}
                    className={`border-y rounded-sm flex items-center gap-1 px-1 ${mode === 'light' ? 'bg-gray-shadow10' : 'bg-gray-shadow1'}`}
                  >
                    <div className="flex items-center gap-4">
                      {offer?.product?.imageURL ? (
                        <Image
                          src={offer.product?.imageURL}
                          alt={offer.product?.name || 'item Image'}
                          width={30}
                          height={30}
                          className="w-9 h-9 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <FaShoppingBag
                          className={`w-9 h-9 text-gray-500 ${mode === 'light' ? 'bg-gray-shadow7' : 'bg-gray-shadow8'} rounded`}
                        />
                      )}
                    </div>

                    <div className="flex-1 flex-col items-start gap-1">
                      <p className="text-base">{offer.product?.name}</p>
                      {/* choices display until width is exhausted */}
                      <p className="text-sm font-thin text-text-gray truncate max-w-[250px]">
                        {(Array.isArray(offer?.selectedChoices)
                          ? offer.selectedChoices
                          : []
                        )
                          .map((obj) => obj.material?.name)
                          .join(', ')
                          .slice(0, 40)}
                      </p>
                    </div>
                    <FaGift className="text-green-500" />
                    <p className="text-sm font-semibold text-green-500">Free</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total amount paid and subtotal details */}
        <div className="flex flex-col gap-1 w-full p-2">
          <hr className="border-brand-gray border-1" />
          <p className="flex items-center justify-between w-full">
            <span className="text-sm">Sub Total</span>
            <span className="text-sm text-text-gray ml-1 font-semibold">
              {subtotal(paidOrderDetails?.items)?.toFixed(2)}
            </span>
          </p>
          <p className="flex items-center justify-between w-full">
            <span className="text-sm">
              Tax ({workBranchVATRate?.toFixed(2)}%)
            </span>
            <span className="text-sm text-text-gray ml-1 font-semibold">
              {getVATAmount(
                paidOrderDetails?.items,
                [],
                workBranchVATRate
              )?.toFixed(2)}
            </span>
          </p>
          {productsTax(paidOrderDetails?.items) &&
            productsTax(paidOrderDetails?.items) > 0 && (
              <p className="flex items-center justify-between w-full">
                <span className="text-sm">Products Tax</span>{' '}
                <span className="text-sm text-text-gray ml-1 font-semibold">
                  {productsTax(paidOrderDetails?.items)?.toFixed(2)}
                </span>
              </p>
            )}
          {cashDiscounts() > 0 && (
            <p className="text-sm flex flex-row justify-between">
              <span>Discount:</span>{' '}
              <span className="text-sm text-text-gray ml-1 font-semibold">
                {'-'}
                {cashDiscounts()?.toFixed(2)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessfulPaymentDisplay;
