import Image from 'next/image';
import React from 'react';
import { FaEdit, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useNotification } from '@/contexts/notificationContext';

const LinkedCustomer = ({
  cart,
  handleUnlinkCustomer,
  linkedCustomerData,
  setIsOpenCustomerOverlay,
}) => {
  const { showNotification } = useNotification();

  const onCustomerUnlink = () => {
    if (cart?.restoredFromScheduledOrder) {
      showNotification(
        'warning',
        'Scheduled Order Modification',
        'You cannot remove a linked customer to an order that was previously scheduled.',
        10000
      );
      return;
    }

    handleUnlinkCustomer;
  };

  const onEditCustomerClick = () => {
    if (cart?.restoredFromScheduledOrder) {
      showNotification(
        'warning',
        'Scheduled Order Modification',
        'You cannot edit a linked customer to an order that was previously scheduled.',
        10000
      );
      return;
    }

    setIsOpenCustomerOverlay(true);
  };

  return (
    <div className="p-2 border-b shadow-lg rounded-md  w-full flex flex-row justify-between items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-lg">
      <div className="flex flex-row font-semibold items-center">
        {/* profile picture if available */}
        {linkedCustomerData?.imageUrl ? (
          <Image
            src={linkedCustomerData?.imageUrl}
            alt={linkedCustomerData.name}
            width={50}
            height={50}
            className="rounded-md object-cover mr-3"
          />
        ) : (
          <FaUserCircle className="text-4xl text-text-gray mr-3" />
        )}
        {/* name and customer ID */}
        <div className="flex flex-col">
          <span>{linkedCustomerData?.name}</span>
          <span className="text-sm font-thin">
            {linkedCustomerData?.customerNumber}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row gap-2">
        {/* Edit linked customer and offers */}
        <span
          className="text-lg text-text-gray hover:bg-gray-shadow7 cursor-pointer p-1 rounded-lg transition-colors duration-200 hover:animate-pulse"
          onClick={onEditCustomerClick}
        >
          <FaEdit title="edit" />
        </span>
        {/* Unlink customer from sale */}
        <span
          className="text-lg text-error bg-red-200 hover:bg-red-500 cursor-pointer p-1 rounded-lg transition-colors duration-200 hover:animate-pulse"
          onClick={onCustomerUnlink}
        >
          <FaTimes title="unlink customer" />
        </span>
      </div>
    </div>
  );
};

export default LinkedCustomer;
