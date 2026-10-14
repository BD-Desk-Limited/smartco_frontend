import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { formatDate, ISOStringToLocalTime } from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';
import { commaNumberFormat } from '@/utilities/numbersUtils';

// avoids float artifacts like 12.299999 in exports
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const PurchaseAndSupplyDetailSideView = ({
  order,
  setOrder,
  STATUS_OPTIONS,
  onExport, // receives { data, title, metadata, fileName } and opens the export modal
}) => {
  const closeSideView = () => setOrder(null);
  const orderStatusOptions =
    STATUS_OPTIONS?.find((ops) => ops.value === order.status) || null;

  // Builds the export from the order already in memory: no extra API call.
  const handleExport = () => {
    const data = (order.orderItems || []).map((i) => ({
      Item: i.name,
      Batch: i.batchNumber || '-',
      Brand: i.brand || '-',
      Expiry: i.expiryDate ? formatDate(new Date(i.expiryDate)) : '-',
      Quantity: i.quantity,
      Unit: i.unit || '-',
      'Unit Cost': round2(i.unitCost),
      'Line Total': round2(i.lineTotal),
    }));

    // each note keeps its own line breaks; notes are separated by a blank line
    const notes = (order.notes || [])
      .map(
        (n) =>
          `${n.detail}\n- ${n.by?.fullName || 'Unknown'}, ${ISOStringToLocalTime(n.createdAt)}`
      )
      .join('\n\n');

    const metadata = {
      'Order ID': order.purchaseID || 'N/A',
      Supplier: `${capitalizeFirst(order.supplierName) || 'N/A'}${
        order.isOpenMarket ? ' (Open market)' : ''
      }`,
      ...(order.supplier?.phone && { Tel: order.supplier.phone }),
      Location: capitalizeFirst(order.receivingBranch?.name) || 'N/A',
      Status: capitalizeFirst(order.status) || 'N/A',
      'Supply date': order.supplyDate
        ? ISOStringToLocalTime(order.supplyDate)
        : 'N/A',
      Created: order.createdAt ? ISOStringToLocalTime(order.createdAt) : 'N/A',
      'Created by': order.createdBy?.fullName || 'N/A',
      Total: commaNumberFormat(order.totalCost || 0, 2),
      ...(notes && { Notes: notes }),
    };

    onExport?.({
      data,
      title: 'Purchase Order Details',
      metadata,
      fileName: `purchase-order_${order.purchaseID || order._id}`,
      emptyMessage: 'No items in this order',
    });
  };

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
      }}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-1/3 h-full bg-text-white flex flex-col p-3 text-sm text-text-gray gap-3 overflow-y-auto"
    >
      {/* close button */}
      <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer m-1">
        <FaTimes className="text-text-white" onClick={closeSideView} />
      </div>

      <div className="flex items-center justify-between pr-8">
        <h3 className="font-semibold text-text-black">
          PURCHASE ORDER DETAILS
        </h3>
        {onExport && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-2 py-1 border border-gray-border rounded-md hover:bg-gray-shadow10"
          >
            <FaPrint aria-hidden="true" /> Print / Export
          </button>
        )}
      </div>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Supplier info:</span>
        <span className="flex flex-col justify-end items-end">
          {order.isOpenMarket && (
            <span className="w-full font-semibold">(Open Market purchase)</span>
          )}

          <span className="w-full font-semibold">
            {capitalizeFirst(order.supplierName) || 'N/A'}
          </span>
          <span className="w-full">Tel: {order.supplier?.phone || 'N/A'}</span>
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
        <span>Order Items:</span>
        <ul className="flex flex-col w-full gap-2 p-2 bg-blue-shadow10 overflow-y-auto scrollbar-thin">
          {order.orderItems?.length ? (
            order.orderItems.map((item) => (
              <li key={item._id} className="flex flex-col w-full border-b">
                <div className="flex justify-between">
                  <span className="text-text-black">{item.name}</span>
                  <span>
                    {item.quantity} {item.unit} ×{' '}
                    {commaNumberFormat(item.unitCost, 2)}
                  </span>
                </div>
                <span className="text-xs">
                  Batch {item.batchNumber}
                  {item.brand ? ` · ${item.brand}` : ''}
                  {item.expiryDate
                    ? ` · Exp ${ISOStringToLocalTime(item.expiryDate)}`
                    : ''}
                </span>
              </li>
            ))
          ) : (
            <li>No items in this order</li>
          )}
        </ul>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{commaNumberFormat(order.totalCost, 2) || '-'}</span>
        </div>
      </div>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Location:</span>
        <span className="flex flex-col justify-end items-end">
          {capitalizeFirst(order.receivingBranch?.name) || 'N/A'}
        </span>
      </div>
      <hr></hr>

      <div className="flex flex-row justify-between">
        <span>Order Status</span>
        <span className="flex flex-col justify-end items-end">
          <span
            className={`${orderStatusOptions?.color ? orderStatusOptions?.color : `bg-gray-500  text-text-white`} p-1 rounded-md`}
          >
            {capitalizeFirst(order.status) || 'N/A'}
          </span>
          <span>
            {order.supplyDate ? ISOStringToLocalTime(order.supplyDate) : 'N/A'}
          </span>
        </span>
      </div>
      <hr></hr>

      <div>
        <span>Notes:</span>
        <ul className="bg-gray-shadow9 rounded-md h-48 overflow-y-auto">
          {order.notes?.length ? (
            order.notes.map((note) => (
              <li
                key={note._id}
                className="p-2 flex flex-col w-full text-text-black"
              >
                <p className="whitespace-pre-wrap break-words">{note.detail}</p>
                <span className="font-thin italic text-right">
                  By: {note.by?.fullName || 'Unknown'} ·{' '}
                  {ISOStringToLocalTime(note.createdAt)}
                </span>
                <hr className="border border-gray-shadow2" />
              </li>
            ))
          ) : (
            <li className="p-2 italic">No notes</li>
          )}
        </ul>
      </div>

      {order.status === 'fulfilled' && (
        <button
          onClick={closeSideView}
          className="w-fit py-2 px-3 rounded-lg bg-brand-blue text-text-white"
        >
          Close
        </button>
      )}
    </motion.div>
  );
};

export default PurchaseAndSupplyDetailSideView;
