import React from 'react';
import BillAndSummary from '../cart/BillAndSummary';
import { useNotification } from '@/contexts/notificationContext';
import {
  FaCartPlus,
  FaChevronDown,
  FaChevronLeft,
  FaUserCircle,
} from 'react-icons/fa';
import Image from 'next/image';
import {
  checkOrderStatusService,
  getOrdersForTodayByBranchIdService,
} from '@/services/orderScheduleServices';
import {
  productsTax,
  itemUnitCost,
  subtotal,
  taxfreeProduct,
} from '../cart/CartBillCalculationFunctions';
import Spinner from '@/components/account/Spinner';

const ScheduledOrdersForToday = ({
  setActiveMenuItem,
  scheduledOrdersForToday,
  setScheduledOrdersForToday,
  workBranch,
  setCart,
  lightThemeStyle,
  darkThemeStyle,
  mode,
}) => {
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedScheduledOrder, setSelectedScheduledOrder] = React.useState(
    (scheduledOrdersForToday && scheduledOrdersForToday[0]) || null
  );
  const [total, setTotal] = React.useState(0);
  const [openDropdown, setOpenDropdown] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  //Fetch scheduled orders data for today.
  React.useEffect(() => {
    const fetchScheduledOrders = async () => {
      setLoading(true);
      if (workBranch?._id) {
        const response = await getOrdersForTodayByBranchIdService(
          workBranch._id
        );
        if (response.data) {
          setScheduledOrdersForToday(response.data);
        } else {
          showNotification(
            'error',
            'Error',
            response.error || 'Error fetching scheduled orders',
            3000
          );
        }
      }
      setLoading(false);
    };

    fetchScheduledOrders();
  }, [workBranch?._id, setScheduledOrdersForToday, showNotification]);

  const filteredOrders = scheduledOrdersForToday?.filter((order) => {
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

  const handleMoveToCart = async (e, order) => {
    e.stopPropagation(); // Prevent triggering parent onClick

    //check if user is online before allowing move to cart action since it requires API call to fetch latest status or order fufillment

    if (!navigator.online) {
      showNotification(
        'error',
        'Offline',
        'You are currently offline. Please connect to the internet to move this order to cart.',
        6000
      );
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await checkOrderStatusService(order.orderId);

      if (data && data.status === 'pending') {
        setCart((prev) => ({
          ...prev,
          restoredFromScheduledOrder: true,
          restoredFromScheduledOrderAt: new Date().toISOString(),
          items: order?.items || [],
          linkedCustomer: order?.linkedCustomer || null,
        }));

        setScheduledOrdersForToday((prev) =>
          prev.filter((o) => o.orderId !== order.orderId)
        );

        showNotification(
          'success',
          'Order Restored',
          `${order?.items?.length || 0} item(s) moved to cart`,
          6000
        );

        setTimeout(() => {
          setActiveMenuItem('cart');
        }, 800);
      } else if (data && data.status === 'fulfilled') {
        showNotification(
          'error',
          'Order Already Fulfilled',
          'This order has already been fulfilled and cannot be moved to cart.',
          6000
        );
      } else {
        showNotification(
          'error',
          'Error',
          error || 'Unable to move order to cart. Please try again.',
          6000
        );
      }
    } catch (error) {
      console.error('Error moving scheduled order to cart:', error);
      showNotification(
        'error',
        'Error',
        'An error occurred while moving the order to cart. Please try again.',
        3000
      );
    } finally {
      setLoading(false);
    }
  };

  const workBranchVATRate =
    workBranch && workBranch.taxBand?.rates[0]?.rate
      ? workBranch.taxBand.rates[0].rate
      : 0;

  console.log('scheduledOrdersForToday:', scheduledOrdersForToday);

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
          {`Scheduled Orders for Today  (${scheduledOrdersForToday?.length || 0})`}
        </p>

        {loading ? (
          <Spinner color="brand-green" />
        ) : filteredOrders?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredOrders?.map((order) => (
              <div
                key={order.orderId}
                onClick={(e) => {
                  setSelectedScheduledOrder(order);
                  handleToggleDropdown(e, order.orderId);
                }}
                className={`flex flex-col ${
                  mode === 'light'
                    ? `hover:bg-gray-shadow8 ${
                        selectedScheduledOrder?.orderId === order.orderId
                          ? 'bg-gray-shadow9 rounded-sm'
                          : ''
                      }`
                    : `hover:bg-gray-shadow2 ${
                        selectedScheduledOrder?.orderId === order.orderId
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
                            `Order scheduled for ${new Date(order.payment?.orderScheduledDateTime).toLocaleString()}`
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
                          `Order scheduled for ${new Date(order.payment?.orderScheduledDateTime).toLocaleString()}`}
                      </span>
                      <span className="text-sm opacity-70">
                        {order.orderId}
                      </span>
                      <span className="text-sm opacity-70">{`Items in Order: ${order.items?.length || 0}`}</span>
                      {order.linkedCustomer && (
                        <span className="text-sm font-semibold opacity-70">{`Order scheduled for: ${new Date(order?.payment?.orderScheduledDateTime).toLocaleString()}`}</span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons and dropdown arrow */}
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        className="text-brand-green transition-colors p-1  rounded-md hover:border"
                        onClick={(e) => handleMoveToCart(e, order)}
                        title="Move order to cart"
                      >
                        <FaCartPlus className="inline-block" />
                      </button>
                    </div>

                    <span>
                      {openDropdown[order.orderId] ? (
                        <FaChevronDown
                          className={`ml-2 text-brand-green font-semibold`}
                          onClick={(e) =>
                            handleToggleDropdown(e, order.orderId)
                          }
                          title="Close item details"
                        />
                      ) : (
                        <FaChevronLeft
                          className={`ml-2 text-brand-green font-semibold`}
                          onClick={(e) =>
                            handleToggleDropdown(e, order.orderId)
                          }
                          title="see items in this order"
                        />
                      )}
                    </span>
                  </div>
                </div>

                {/* Dropdown content */}
                {openDropdown[order?.orderId] && (
                  <div className={`w-full mt-2 px-5 shadow-sm`}>
                    <span className="text-sm font-semibold">Order Items:</span>
                    {order?.items?.length > 0 ? (
                      <ul className="text-sm w-full">
                        {order?.items?.map((item) => (
                          <li
                            key={`${item.cartItemId}`}
                            className="border-y py-2 flex justify-between"
                          >
                            <span>{item.product?.name}</span>
                            <span>Qty: {item?.quantity}</span>
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
              {scheduledOrdersForToday?.length > 0
                ? ` No matching scheduled orders found for "${searchTerm}".`
                : `No scheduled orders available.`}
            </p>
          </div>
        )}
      </div>
      <div className="w-2/5 h-full p-3">
        {selectedScheduledOrder && (
          <>
            {/* Payment details */}
            <div className="rounded-md border my-2 text-sm font-semibold">
              <div className="p-2 flex flex-col gap-1">
                <span>
                  <span className="font-thin">Payment Method: </span>
                  {selectedScheduledOrder?.payment?.paymentType || 'N/A'}
                </span>
                <span>
                  <span className="font-thin">Paid: </span>
                  {selectedScheduledOrder?.payment?.selectedPaymentPlan
                    ?.value || 'N/A'}
                </span>
                <span>
                  <span className="font-thin">Balance to pay: </span>
                  {(
                    selectedScheduledOrder?.payment?.total -
                    selectedScheduledOrder?.payment?.selectedPaymentPlan
                      ?.amountPaid
                  )?.toFixed(2) || 'N/A'}
                </span>
              </div>
            </div>
            <BillAndSummary
              cartItems={selectedScheduledOrder?.items || []}
              linkedCustomerData={
                selectedScheduledOrder?.linkedCustomer || null
              }
              productsTax={productsTax}
              subtotal={subtotal}
              workBranchVATRate={workBranchVATRate}
              taxfreeProduct={taxfreeProduct}
              itemUnitCost={itemUnitCost}
              showButtons={false}
              setTotal={setTotal}
              mode={mode}
              lightThemeStyle={lightThemeStyle}
              darkThemeStyle={darkThemeStyle}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ScheduledOrdersForToday;
