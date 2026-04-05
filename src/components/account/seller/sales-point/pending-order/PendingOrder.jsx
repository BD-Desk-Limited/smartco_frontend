import React from 'react';
import { useNotification } from '@/contexts/notificationContext';
import {
  FaCartPlus,
  FaChevronDown,
  FaChevronLeft,
  FaTrash,
  FaUserCircle,
} from 'react-icons/fa';
import BillAndSummary from '../cart/BillAndSummary';
import {
  productsTax,
  itemUnitCost,
  subtotal,
  taxfreeProduct,
} from '../cart/CartBillCalculationFunctions';
import Image from 'next/image';

const PendingOrder = ({
  pendingOrders,
  setPendingOrders,
  handlePendOrder,
  setCart,
  setActiveMenuItem,
  workBranch,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPendingOrder, setSelectedPendingOrder] = React.useState(null);
  const [openDropdown, setOpenDropdown] = React.useState({});
  const workBranchVATRate =
    workBranch && workBranch.taxBand?.rates[0]?.rate
      ? workBranch.taxBand.rates[0].rate
      : 0;

  const handleMoveToCart = (pendingOrder) => {
    setCart((prev) => ({
      ...prev,
      items: pendingOrder?.items || [],
      linkedCustomer: pendingOrder?.linkedCustomer || null,
    }));

    setPendingOrders((prev) =>
      prev.filter((order) => order.id !== pendingOrder.id)
    );

    showNotification(
      'success',
      'Order Restored',
      `${pendingOrder?.items?.length || 0} item(s) moved to cart`,
      3000
    );

    setTimeout(() => {
      setActiveMenuItem('cart');
    }, 800);
  };

  const handleDeletePendingOrder = (orderId) => {
    setPendingOrders((prev) => prev.filter((order) => order.id !== orderId));
    setSelectedPendingOrder((prev) => (prev?.id === orderId ? null : prev)); // Clear selected order if it's the one being deleted
    showNotification(
      'warning',
      'Order Deleted',
      'Pending order has been removed',
      2000
    );
  };

  const filteredOrders = pendingOrders.filter((order) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const customerName = order.linkedCustomer?.name?.toLowerCase() || '';
    const customerNumber =
      order.linkedCustomer?.customerNumber?.toLowerCase() || '';
    const itemInOrder =
      order.items
        ?.map((item) => item.product?.name)
        .join(' ')
        .toLowerCase() || '';

    // Check if search term matches customer name, number, or any product name in the order
    return (
      customerName.includes(lowerSearchTerm) ||
      customerNumber.includes(lowerSearchTerm) ||
      itemInOrder.includes(lowerSearchTerm)
    );
  });

  const handleToggleDropdown = (e, orderId) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    setOpenDropdown((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="h-full w-full p-1 flex flex-row justify-between relative">
      {/* back button */}
      <button
        className="p-1 absolute top-1 left-1 z-10 text-brand-green hover:scale-105 transition-transform rounded-md"
        onClick={() => setActiveMenuItem('sales-items')}
      >
        <FaChevronLeft className="inline-block" />
        <FaChevronLeft className="inline-block mr-1" />
        Back
      </button>

      <div
        className={` w-3/5 h-full p-5 rounded-lg overflow-y-auto no-scrollbar ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
      >
        <div className="p-3 w-full flex items-center justify-center">
          <input
            type="text"
            placeholder="Search pending orders by customer name, number, or an item in order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-3/4 p-2 text-sm text-text-gray rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gray focus:border-transparent"
          />
        </div>

        <hr className="my-2 border-gray-300" />
        <p className="font-semibold">
          {`Pending Orders  (${pendingOrders?.length || 0})`}
        </p>

        {filteredOrders?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredOrders?.map((order) => (
              <div
                key={order.id}
                onClick={(e) => {
                  setSelectedPendingOrder(order);
                  handleToggleDropdown(e, order.id);
                }}
                className={`flex flex-col ${
                  mode === 'light'
                    ? `hover:bg-gray-shadow8 ${
                        selectedPendingOrder?.id === order.id
                          ? 'bg-gray-shadow9 rounded-sm'
                          : ''
                      }`
                    : `hover:bg-gray-shadow2 ${
                        selectedPendingOrder?.id === order.id
                          ? 'bg-gray-shadow1 rounded-sm'
                          : ''
                      }`
                } cursor-pointer p-2 flex items-center justify-between transition-colors shadow-sm`}
              >
                {/* Order list items */}
                <div className="w-full flex flex-row items-center justify-between">
                  {/* Customer/order info with profile image or icon */}
                  <div className="flex flex-row gap-2">
                    <span className="text-sm font-medium w-10 h-10 flex items-center justify-center bg-gray-200 rounded-sm overflow-hidden">
                      {order?.linkedCustomer?.imageUrl ? (
                        <Image
                          src={order.linkedCustomer?.imageUrl}
                          alt={
                            order.linkedCustomer?.name?.charAt(0) ||
                            `Order added ${new Date(order.pendTime).toLocaleString()}`
                          }
                          width={40}
                          height={40}
                          className="rounded-sm object-contain"
                        />
                      ) : (
                        <FaUserCircle className="text-brand-green" size={24} />
                      )}
                    </span>

                    <div className="flex flex-col text-left">
                      <span className="font-semibold">
                        {order.linkedCustomer?.name ||
                          `Order added ${new Date(order.pendTime).toLocaleString()}`}
                      </span>
                      <span className="text-sm opacity-70">{order.id}</span>
                      <span className="text-sm opacity-70">{`Items in Order: ${order.items?.length || 0}`}</span>
                    </div>
                  </div>

                  {/* Action buttons and dropdown arrow */}
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        className="text-brand-green transition-colors p-1  rounded-md hover:border"
                        onClick={() => handleMoveToCart(order)}
                      >
                        <FaCartPlus className="inline-block" />
                      </button>
                      <button
                        className="text-error transition-colors p-1 rounded-md hover:border"
                        onClick={() => handleDeletePendingOrder(order.id)}
                      >
                        <FaTrash className="inline-block" />
                      </button>
                    </div>

                    <span>
                      {openDropdown[order.id] ? (
                        <FaChevronDown
                          className={`ml-2 text-brand-green font-semibold`}
                          onClick={(e) => handleToggleDropdown(e, order.id)}
                        />
                      ) : (
                        <FaChevronLeft
                          className={`ml-2 text-brand-green font-semibold`}
                          onClick={(e) => handleToggleDropdown(e, order.id)}
                        />
                      )}
                    </span>
                  </div>
                </div>

                {/* Dropdown content */}
                {openDropdown[order.id] && (
                  <div className={`w-full mt-2 px-5 shadow-sm`}>
                    <span className="text-sm font-semibold">Order Items:</span>
                    {order?.items?.length > 0 ? (
                      <ul className="text-sm w-full">
                        {order.items.map((item) => (
                          <li
                            key={item.id}
                            className="border-y py-2 flex justify-between"
                          >
                            <span>{item.product?.name}</span>
                            <span>Qty: {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm opacity-70">
                        No items in this order.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-[70%] flex items-center justify-center">
            <p className="text-base opacity-70">
              {pendingOrders?.length > 0
                ? ` No matching pending orders found for "${searchTerm}".`
                : `No pending orders available.`}
            </p>
          </div>
        )}
      </div>

      <div className="w-2/5 h-full p-3">
        {selectedPendingOrder && (
          <BillAndSummary
            cartItems={selectedPendingOrder?.items || []}
            linkedCustomerData={selectedPendingOrder?.linkedCustomer || null}
            productsTax={productsTax}
            subtotal={subtotal}
            handlePendOrder={handlePendOrder}
            workBranchVATRate={workBranchVATRate}
            taxfreeProduct={taxfreeProduct}
            itemUnitCost={itemUnitCost}
            showButtons={false}
            mode={mode}
            lightThemeStyle={lightThemeStyle}
            darkThemeStyle={darkThemeStyle}
          />
        )}
      </div>
    </div>
  );
};

export default PendingOrder;
