import Button from '@/components/account/Button';
import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { formatDate, ISOStringToLocalTime } from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';

const PurchaseAndSupplyDetailSideView = ({
  order,
  setOrder,
  STATUS_OPTIONS,
}) => {
  const closeSideView = () => setOrder(null);
  const orderStatusOptions = STATUS_OPTIONS?.find(
    (ops) => ops.value === order.status
  );

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
      }}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-1/3 h-full bg-text-white flex flex-col p-3 text-sm text-text-gray gap-3"
    >
      {/* close button */}
      <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer m-1">
        <FaTimes className="text-text-white" onClick={closeSideView} />
      </div>

      <h3 className="font-semibold text-text-black">PURCHASE ORDER DETAILS</h3>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Supplier info:</span>
        <span className="flex flex-col justify-end items-end">
          <span className="w-full">{order.supplierName || 'N/A'}</span>
          <span className="w-full">Tel: {order.supplierTel || 'N/A'}</span>
        </span>
      </div>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Order ID</span>
        <span className="flex flex-col justify-end items-end">
          <span className="w-full">{order.purchaseID || 'N/A'}</span>
        </span>
      </div>
      <hr></hr>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <span>Order Created:</span>
          <span className="flex flex-col justify-end items-end">
            {order.createdAt ? ISOStringToLocalTime(order?.createdAt) : 'N/A'}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span>By:</span>
          <span className="flex flex-col justify-end items-end">
            {order.createdBy ? order?.createdBy?.fullName : 'N/A'}
          </span>
        </div>
      </div>
      <hr></hr>

      <div className="flex flex-col justify-between">
        <span>Order Items</span>
        <ul className="flex flex-col justify-end items-end">
          {order?.orderItems?.map((item, indx) => (
            <li key={indx}>
              <span>{item._id}</span>
            </li>
          ))}
        </ul>
      </div>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Location:</span>
        <span className="flex flex-col justify-end items-end">
          {order.receivingBranch.name}
        </span>
      </div>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Order Status</span>
        <span className="flex flex-col justify-end items-end">
          <span className={`${orderStatusOptions.color} p-1 rounded-md`}>
            {capitalizeFirst(order.status) || 'N/A'}
          </span>
          <span> {ISOStringToLocalTime(order.supplyDate) || 'N/A'}</span>
        </span>
      </div>
      <hr></hr>

      <div>
        <span>Notes:</span>
        <div className="bg-gray-shadow9 rounded-md h-48">
          {order.notes?.map((note, indx) => (
            <li key={indx} className="p-2 flex flex-col w-full text-text-black">
              <span>{note?.detail}</span>
              <span className="font-thin italic text-right">
                By: {note?.by?.fullName}
              </span>
              <hr className="border border-gray-shadow2"></hr>
            </li>
          ))}
        </div>
      </div>

      {order.status === 'fulfilled' && (
        <button
          onClick={closeSideView}
          className="w-fit py-2 px-3 rounded-lg bg-brand-blue text-text-white"
        >
          Done
        </button>
      )}
    </motion.div>
  );
};

export default PurchaseAndSupplyDetailSideView;
