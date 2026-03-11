import React from 'react';
import HeadBar from '../HeadBar';
import Footer from '../Footer';
import { motion } from 'framer-motion';
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
}) => {
  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedChoices, setSelectedChoices] = React.useState({}); //select options for products that have multiple option components
  const [cartItems, setCartItems] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [openSelectProductComponents, setOpenSelectProductComponents] =
    React.useState(false);

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

  const onClose = () => {
    setSelectedProduct(null);
    setSelectedChoices({});
    setQuantity(1);
    setOpenSelectProductComponents(false);
  };

  const handleAddToCart = (product, choices, quantity) => {
    // construct cart
    const newProduct = {
      product: product,
      quantity: quantity,
      choices: Object.entries(choices).map(([_, choice]) => ({
        choice: choice,
      })),
    };

    // check if product with same choices already exists in cart, if yes, increase quantity
    const existingInCart = cartItems.find((item) => {
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
      setCartItems((prev) => {
        const filtered = prev.filter((item) => item !== existingInCart);
        return [...filtered, { ...existingInCart, quantity: updatedQuantity }];
      });
    } else {
      setCartItems((prev) => [newProduct, ...prev]);
    }
    onClose();
  };
  console.log('CART:', cartItems);

  const handleSelectComponents = () => {
    if (selectedProduct?.availabilityStatus !== 'in Stock') return; // Prevent selection if product is not in stock
    setOpenSelectProductComponents(true);
  };

  return (
    <div className="h-screen overflow-y-auto no-scrollbar flex flex-col items-center relative">
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        cartItems={cartItems}
        setCartItems={setCartItems}
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
          cartItems={cartItems}
          setCartItems={setCartItems}
          handleAddToCart={handleAddToCart}
          workBranch={workBranch}
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
