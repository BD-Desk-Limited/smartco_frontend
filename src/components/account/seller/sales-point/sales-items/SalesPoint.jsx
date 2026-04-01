import React, { useMemo } from 'react';
import HeadBar from '../HeadBar';
import Footer from '../Footer';
import { motion } from 'framer-motion';
import { useSalesPoint } from '@/contexts/salesPointContext';
import { useAuth } from '@/contexts/authContext';
import SalesPointContent from './SalesPointContent';
import { loadProducts } from '../productFetchManagement';
import SelectedProductCard from './SelectedProductCard';
import { FaTimes } from 'react-icons/fa';

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
  const hydratedFromContextRef = React.useRef(false);
  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedChoices, setSelectedChoices] = React.useState({}); //select options for products that have multiple option components
  const [cart, setCart] = React.useState({});
  const [pendingOrders, setPendingOrders] = React.useState([]);
  const [pendingCustomerRegistration, setPendingCustomerRegistration] =
    React.useState([]);
  const [pendingOrderSchedule, setPendingOrderSchedule] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [pendingError, setPendingError] = React.useState(null);
  const [openSelectProductComponents, setOpenSelectProductComponents] =
    React.useState(false);

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
    onClose();
  };

  console.log(
    'Pending orders from context:',
    salesPointState?.find((s) => s.seller === user?._id)?.states?.pending_orders
  );

  const handleSelectComponents = () => {
    if (selectedProduct?.availabilityStatus !== 'in Stock') return; // Prevent selection if product is not in stock
    setOpenSelectProductComponents(true);
  };

  return (
    <div className="h-screen overflow-y-auto no-scrollbar flex flex-col items-center relative">
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        cart={cart}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />
      <div className="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar w-full flex items-center justify-center relative">
        <SalesPointContent
          mode={mode}
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          lightThemeStyle={lightThemeStyle}
          darkThemeStyle={darkThemeStyle}
          loading={loading}
          setLoading={setLoading}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          error={error}
          setError={setError}
          products={products}
          setProducts={setProducts}
          cart={cart}
          setCart={setCart}
          pendingOrders={pendingOrders}
          setPendingOrders={setPendingOrders}
          pendingCustomerRegistration={pendingCustomerRegistration}
          setPendingCustomerRegistration={setPendingCustomerRegistration}
          pendingOrderSchedule={pendingOrderSchedule}
          setPendingOrderSchedule={setPendingOrderSchedule}
          pendingError={pendingError}
          setPendingError={setPendingError}
          handleAddToCart={handleAddToCart}
          workBranch={workBranch}
          workBranchKey={workBranchKey}
        />
      </div>

      <Footer
        mode={mode}
        setMode={setMode}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />

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
    </div>
  );
};

export default SalesPoint;
