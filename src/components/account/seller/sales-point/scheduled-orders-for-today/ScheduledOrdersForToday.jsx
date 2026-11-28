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
  localYmd,
} from '@/services/orderScheduleServices';
import { useAuth } from '@/contexts/authContext';
import {
  productsTax,
  itemUnitCost,
  subtotal,
  taxfreeProduct,
} from '../cart/CartBillCalculationFunctions';
import Spinner from '@/components/account/common/Spinner';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import { methodLabel } from '@/utilities/paymentMethods';

const MAX_RANGE_DAYS = 93; // the server allows the same
const daysBetween = (fromYmd, toYmd) =>
  Math.round((new Date(toYmd) - new Date(fromYmd)) / 86400000) + 1;
const shiftDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return localYmd(d);
};
const showDate = (ymd) => new Date(`${ymd}T00:00`).toLocaleDateString();

// what the customer has paid towards a scheduled order
const paidSoFar = (order) => order?.payment?.amountPaid || 0; // paid less refunded

// payments and refunds on an order, oldest first
const paymentHistory = (order) =>
  [
    ...(order?.payment?.entries || []).map((e) => ({ ...e, at: e.paidAt })),
    ...(order?.payment?.refunds || []).map((r) => ({
      ...r,
      at: r.refundedAt,
      refund: true,
    })),
  ].sort((a, b) => new Date(a.at) - new Date(b.at));

const ScheduledOrdersForToday = ({
  setActiveMenuItem,
  workBranch,
  cart,
  setCart,
  lightThemeStyle,
  darkThemeStyle,
  mode,
}) => {
  const { showNotification } = useNotification();
  const { user } = useAuth();
  // a manager or admin can look at other days: to fulfil an order whose customer came after (or
  // before) its date. A cashier sees today's only.
  const canPickDates =
    ['manager', 'admin'].includes(user?.role) || user?.superAdmin === true;
  const today = localYmd();
  const [dates, setDates] = React.useState({ from: today, to: today });
  const datesValid =
    Boolean(dates.from && dates.to) &&
    dates.from <= dates.to &&
    daysBetween(dates.from, dates.to) <= MAX_RANGE_DAYS;
  const shownFrom = canPickDates && datesValid ? dates.from : today;
  const shownTo = canPickDates && datesValid ? dates.to : today;
  const isTodayOnly = shownFrom === today && shownTo === today;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [scheduledOrdersForToday, setScheduledOrdersForToday] = React.useState(
    []
  );
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
        try {
          const response = await getOrdersForTodayByBranchIdService(
            workBranch._id,
            { from: shownFrom, to: shownTo }
          );
          if (response.data) {
            setScheduledOrdersForToday(response.data);
          } else if (response.error) {
            showNotification('error', 'Error', response.error, 4000);
          }
        } catch (error) {
          console.error('Error fetching scheduled orders for today:', error);
          showNotification(
            'error',
            'Error',
            'An error occurred while fetching scheduled orders. Please try again.',
            3000
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchScheduledOrders();
  }, [workBranch?._id, shownFrom, shownTo, showNotification]);

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
    if (!navigator.onLine) {
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
      const { data, error } = await getOrdersForTodayByBranchIdService(
        workBranch._id,
        { from: shownFrom, to: shownTo }
      );

      if (data) {
        //map through the orderIds to see if the current order matches any orderId still scheduled for today. If it doesn't then it means the order has already been fulfilled and we should prevent moving it to cart and show error notification instead.
        // restore from this fresh copy, not the list loaded earlier: its version, payments and
        // refunds are as they are right now
        const latest = data.find(
          (scheduledOrder) => scheduledOrder.orderId === order.orderId
        );
        const isOrderStillScheduled = Boolean(latest);

        if (isOrderStillScheduled) {
          // mark the order as restored from scheduled order
          setCart((prev) => ({
            ...prev,
            orderId: latest.orderId,
            // the version this checkout is made on: if the order changes before it syncs
            // (cancelled, fulfilled elsewhere), the server ignores the checkout
            orderRevision: latest.revision,
            restoredFromScheduledOrder: true,
            restoredFromScheduledOrderAt: new Date().toISOString(),
            items: latest?.items || [],
            linkedCustomer: latest?.linkedCustomer || null,
            payment: {
              ...latest.payment, // includes entries and refunds, shown on the payment page
              selectedFulfillmentTime: 'Now',
              // chosen afresh at this checkout: how much is paid NOW (if it is scheduled again)
              selectedPaymentPlan: null,
              partialAmountNow: 0,
            },
            // paid less refunded; the payment page adds only what is collected now
            amountPaid: paidSoFar(latest),
          }));

          showNotification(
            'success',
            'Order Restored',
            `${order?.items?.length || 0} item(s) moved to cart`,
            6000
          );

          setActiveMenuItem('cart');
        } else if (!isOrderStillScheduled) {
          showNotification(
            'error',
            'Order No Longer Scheduled',
            'This order has been fulfilled, cancelled or moved to a day outside the dates shown, so it cannot be moved to cart.',
            6000
          );
        }
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

        {canPickDates && (
          <div className="px-3 pb-2 flex flex-wrap items-end gap-2 text-sm">
            <label className="flex flex-col">
              <span className="text-xs opacity-70">Due from</span>
              <input
                type="date"
                value={dates.from}
                max={dates.to || undefined}
                onChange={(e) =>
                  setDates((d) => ({ ...d, from: e.target.value }))
                }
                className="p-1 rounded-md border-2 border-gray-300 text-text-gray"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-xs opacity-70">to</span>
              <input
                type="date"
                value={dates.to}
                min={dates.from || undefined}
                onChange={(e) =>
                  setDates((d) => ({ ...d, to: e.target.value }))
                }
                className="p-1 rounded-md border-2 border-gray-300 text-text-gray"
              />
            </label>
            <button
              type="button"
              onClick={() => setDates({ from: today, to: today })}
              className="px-2 py-1 rounded-md border border-brand-green text-brand-green"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() =>
                setDates({ from: shiftDays(-30), to: shiftDays(-1) })
              }
              className="px-2 py-1 rounded-md border border-brand-green text-brand-green"
              title="Orders due in the last 30 days that are still open (not fulfilled or cancelled)"
            >
              Past due (30 days)
            </button>
            {!datesValid && (
              <span className="text-xs text-red-500 w-full">
                Pick a start date on or before the end date, at most{' '}
                {MAX_RANGE_DAYS} days apart. Showing today.
              </span>
            )}
          </div>
        )}

        <hr className="my-2 border-gray-300" />
        <p className="font-semibold">
          {isTodayOnly
            ? `Scheduled Orders for Today  (${scheduledOrdersForToday?.length || 0})`
            : `Scheduled Orders due ${showDate(shownFrom)} - ${showDate(shownTo)}  (${scheduledOrdersForToday?.length || 0})`}
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
                        {order.isOverdue && (
                          <span className="ml-2 text-xs rounded px-1.5 py-0.5 bg-red-100 text-red-700">
                            Past due
                          </span>
                        )}
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
              {!loading && scheduledOrdersForToday?.length > 0
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
                  <span className="font-thin">Payment: </span>
                  {selectedScheduledOrder?.payment?.selectedPaymentPlan
                    ?.label || 'N/A'}
                </span>
                <span>
                  <span className="font-thin">Paid so far: </span>
                  {commaNumberFormat(paidSoFar(selectedScheduledOrder), 2)}
                </span>
                <span>
                  <span className="font-thin">Balance to pay: </span>
                  {commaNumberFormat(
                    selectedScheduledOrder?.payment?.balanceDue || 0,
                    2
                  )}
                  <span className="font-thin text-xs block">
                    At the prices when scheduled; the final price is
                    today&apos;s.
                  </span>
                </span>
                {paymentHistory(selectedScheduledOrder).length > 0 && (
                  <ul className="mt-1 border-t pt-1 font-normal">
                    {paymentHistory(selectedScheduledOrder).map((line, i) => (
                      <li
                        key={`${line.at}-${i}`}
                        className={`flex justify-between gap-2 ${line.refund ? 'text-red-500' : ''}`}
                      >
                        <span className="opacity-70">
                          {new Date(line.at).toLocaleString()}
                          {line.refund ? ' · Refund' : ''}
                        </span>
                        <span>
                          {`${line.refund ? '-' : ''}${commaNumberFormat(line.amount, 2)} (${methodLabel(line.method)})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
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
