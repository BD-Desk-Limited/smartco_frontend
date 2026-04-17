import React, { useMemo } from 'react';
import HeadBar from './HeadBar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { useSalesPoint } from '@/contexts/salesPointContext';
import { useAuth } from '@/contexts/authContext';
import { useNotification } from '@/contexts/notificationContext';
import SalesPointContent from './SalesPointContent';
import PendingOrder from './pending-order/PendingOrder';
import { loadProducts } from './productFetchManagement';
import SelectedProductCard from './sales-items/SelectedProductCard';
import { FaTimes } from 'react-icons/fa';
import SubHeadbar from './SubHeadbar';
import SalesPointNotification from './notifications/SalesPointNotification';
import ScheduledOrdersForToday from './scheduled-orders-for-today/ScheduledOrdersForToday';
import SuccessfullPaymentCard from './payment/SuccessfullPaymentCard';

const SalesPoint = ({
  mode,
  setMode,
  menuItems,
  activeMenuItem,
  setActiveMenuItem,
  lightThemeStyle,
  darkThemeStyle,
  workBranch,
  workBranchKey,
}) => {
  const { salesPointState, handleUpdateSalesPointState, loadingContext } =
    useSalesPoint();
  const { user, isLoading } = useAuth();
  const { notification, hideNotification } = useNotification();
  const hydratedFromContextRef = React.useRef(false);
  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedChoices, setSelectedChoices] = React.useState({}); //select options for products that have multiple option components
  const [cart, setCart] = React.useState({
    linkedCustomer: null,
    items: [],
  });
  const [showReceipt, setShowReceipt] = React.useState({
    success: false,
    order: null,
  });
  const [pendingOrders, setPendingOrders] = React.useState([]);
  const [pendingCustomerRegistration, setPendingCustomerRegistration] =
    React.useState([]);
  const [pendingOrderSchedule, setPendingOrderSchedule] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [openSelectProductComponents, setOpenSelectProductComponents] =
    React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('All Products');
  const [scanMode, setScanMode] = React.useState(true);
  const filterRef = React.useRef(null);
  const searchRef = React.useRef(null);

  // Map sales point state keys to local state setters and current values.
  const SALES_POINT_STATE_BY_KEY = useMemo(
    () => ({
      cart: {
        value: cart,
        setValue: setCart,
      },
      pending_orders: {
        value: pendingOrders,
        setValue: setPendingOrders,
      },
      pending_customer_registration: {
        value: pendingCustomerRegistration,
        setValue: setPendingCustomerRegistration,
      },
      pending_order_schedule: {
        value: pendingOrderSchedule,
        setValue: setPendingOrderSchedule,
      },
    }),
    [cart, pendingOrders, pendingCustomerRegistration, pendingOrderSchedule]
  );

  const MAX_ALLOWED_PENDING_ORDERS = 5; // Maximum number of pending orders allowed, can be adjusted as needed

  // Load products on component mount and whenever the sales point is reset.
  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedProducts = await loadProducts();
        setProducts(loadedProducts);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset hydration marker when switching users to ensure fresh state is loaded.
  React.useEffect(() => {
    hydratedFromContextRef.current = false;
  }, [user?._id]);

  // Load persisted user sales point state once per user.
  React.useEffect(() => {
    if (
      isLoading ||
      loadingContext ||
      !user?._id ||
      hydratedFromContextRef.current
    )
      return;

    const existingSellerState = salesPointState?.find(
      (sellerState) => sellerState.seller === user?._id
    );

    if (existingSellerState?.states) {
      // Hydrate local state from persisted context state.
      Object.entries(existingSellerState.states).forEach(([key, value]) => {
        if (SALES_POINT_STATE_BY_KEY[key]) {
          SALES_POINT_STATE_BY_KEY[key].setValue(value);
        }
      });
    }

    hydratedFromContextRef.current = true;
  }, [
    isLoading,
    loadingContext,
    user?._id,
    salesPointState,
    SALES_POINT_STATE_BY_KEY,
  ]);

  // Sync local state changes into persisted context state.
  React.useEffect(() => {
    if (
      isLoading ||
      loadingContext ||
      !user?._id ||
      !hydratedFromContextRef.current
    )
      return;

    Object.entries(SALES_POINT_STATE_BY_KEY).forEach(([key, stateConfig]) => {
      handleUpdateSalesPointState(user._id, key, stateConfig.value);
    });
  }, [
    isLoading,
    loadingContext,
    user?._id,
    handleUpdateSalesPointState,
    SALES_POINT_STATE_BY_KEY,
  ]);

  const onClose = () => {
    setSelectedProduct(null);
    setSelectedChoices({});
    setQuantity(1);
    setOpenSelectProductComponents(false);
  };

  const handleAddToCart = (
    product,
    choices,
    quantity,
    isPromoOffer = false
  ) => {
    // construct cart
    const newProduct = {
      cartItemId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      isPromo: isPromoOffer || false,
      product: product,
      quantity: quantity,
      choices: Object.entries(choices).map(([_, choice]) => ({
        choice: choice,
      })),
    };

    // check if product with same choices already exists in cart, if yes, increase quantity
    const existingInCart = cart?.items?.find((item) => {
      if (item.product._id !== newProduct.product._id) return false;

      const checkChoices = (whatToCheck) =>
        whatToCheck.choices
          ?.map((c) => c.choice?.material?._id)
          .sort()
          .join(',');

      const newChoices = checkChoices(newProduct);
      const existingChoices = checkChoices(item);
      return newChoices === existingChoices;
    });

    if (existingInCart) {
      const updatedQuantity = existingInCart.quantity + newProduct.quantity;

      // replace the existing item in cart with the updated one
      setCart((prev) => {
        const filteredItems = prev?.items?.filter(
          (item) => item !== existingInCart
        );
        return {
          ...prev,
          items: [
            { ...existingInCart, quantity: updatedQuantity },
            ...filteredItems,
          ],
        };
      });
    } else {
      setCart((prev) => ({
        ...prev,
        items: [...(prev?.items || []), newProduct],
      }));
    }
    //mark the time when the first product was added, to track how long each transaction takes from start to finish
    const orderId = `ID-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (!cart?.orderStartTime || !cart?.orderId) {
      setCart((prev) => ({
        ...prev,
        orderStartTime: prev.orderStartTime || new Date().toISOString(),
        orderId: prev.orderId || orderId,
      }));
    }
    onClose();
  };

  const handleCheckout = () => {
    setCart((prev) => ({
      ...prev,
      checkoutInitiatedAt: prev.checkoutInitiatedAt || new Date().toISOString(),
    }));
    setActiveMenuItem('payment');
  };

  const handleSelectComponents = () => {
    if (selectedProduct?.availabilityStatus !== 'in Stock') return; // Prevent selection if product is not in stock
    setOpenSelectProductComponents(true);
  };

  const sharedContentProps = {
    mode,
    activeMenuItem,
    setActiveMenuItem,
    lightThemeStyle,
    darkThemeStyle,
    showReceipt,
    setShowReceipt,
    MAX_ALLOWED_PENDING_ORDERS,
    loading,
    setLoading,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    error,
    setError,
    products,
    setProducts,
    filterRef,
    filterValue,
    setFilterValue,
    searchRef,
    searchTerm,
    setSearchTerm,
    scanMode,
    setScanMode,
    cart,
    setCart,
    setShowReceipt,
    pendingOrders,
    setPendingOrders,
    MAX_ALLOWED_PENDING_ORDERS,
    pendingCustomerRegistration,
    setPendingCustomerRegistration,
    pendingOrderSchedule,
    setPendingOrderSchedule,
    handleAddToCart,
    handleCheckout,
    workBranch,
    workBranchKey,
  };

  // map active menu item to content component - if no match, default to sales point content to allow dynamic switching between numerous submenus
  const CONTENT_COMPONENT_MAP = {
    'sales-items': SalesPointContent,
    cart: SalesPointContent,
    payment: SalesPointContent,
    'pending-orders': PendingOrder,
    'scheduled-orders-for-today': ScheduledOrdersForToday,
  };

  // Determine which content component to render based on the active menu item. If the active menu item doesn't have a specific component, default to SalesPointContent.
  const ActiveContentComponent =
    CONTENT_COMPONENT_MAP[activeMenuItem] || SalesPointContent;

  return (
    <div className="h-screen overflow-y-auto no-scrollbar flex flex-col items-center relative">
      {/* HeadBar with props for mode, menu items, cart, and active menu item */}
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        cart={cart}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />

      {/* Top search and filter bar */}
      <SubHeadbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setScanMode={setScanMode}
        searchRef={searchRef}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterRef={filterRef}
        mode={mode}
        lightThemeStyle={lightThemeStyle}
        darkThemeStyle={darkThemeStyle}
        pendingOrders={pendingOrders}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
      />

      {/* Content area with dynamic component based on active menu item */}
      <div className="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar w-full flex items-center justify-center relative">
        <ActiveContentComponent {...sharedContentProps} />
      </div>

      {/* Footer */}
      <Footer
        mode={mode}
        setMode={setMode}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />

      {/* Global Notification for Sales Point */}
      {notification && (
        <SalesPointNotification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          autoCloseDuration={notification.autoCloseDuration || 3000}
          onClose={hideNotification}
          position="top-right"
        />
      )}

      {/* Overlay for selected product, onclick outside, close it */}
      {selectedProduct && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50`}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '', y: '50%' }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-[640px] h-[70vh] flex justify-center items-center opacity-95 rounded-xl p-5 relative ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* close product modal */}
            {
              <button
                className={`absolute top-3 right-3 text-text-white transition-colors duration-200 bg-opacity-30 bg-error rounded-full p-1 hover:bg-opacity-50`}
                onClick={onClose}
              >
                <FaTimes className={`text-lg hover:text-error-hover`} />
              </button>
            }
            <SelectedProductCard
              product={selectedProduct}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedChoices={selectedChoices}
              setSelectedChoices={setSelectedChoices}
              mode={mode}
              lightThemeStyle={lightThemeStyle}
              darkThemeStyle={darkThemeStyle}
              onClose={onClose}
              handleAddToCart={handleAddToCart}
              handleSelectComponents={handleSelectComponents}
              openSelectProductComponents={openSelectProductComponents}
              setOpenSelectProductComponents={setOpenSelectProductComponents}
            />
          </motion.div>
        </div>
      )}

      {/* Show successful payment card if payment was successful and there is a last paid order to display details for */}
      {showReceipt.success &&
        showReceipt?.order?.payment?.paymentStatus?.value === 'success' &&
        showReceipt?.order !== null && (
          <div
            className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-10`}
          >
            <SuccessfullPaymentCard
              paidOrderDetails={showReceipt?.order}
              paymentData={showReceipt?.order?.payment}
              mode={mode}
              workBranch={workBranch}
              lightThemeStyle={lightThemeStyle}
              darkThemeStyle={darkThemeStyle}
              showReceipt={showReceipt}
              setShowReceipt={setShowReceipt}
            />
          </div>
        )}
    </div>
  );
};

export default SalesPoint;
