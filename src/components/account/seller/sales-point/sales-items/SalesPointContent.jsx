import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SalesPointProducts from '../sales-items/SalesPointProducts';
import { fetchProductsFromAPI, loadProducts } from '../productFetchManagement';
import Cart from '../cart/Cart';
import Customers from '../customers/Customers';
import Payments from '../payments/Payments';

const SalesPointContent = ({
  mode,
  activeMenuItem,
  setActiveMenuItem,
  lightThemeStyle,
  darkThemeStyle,
  loading,
  setLoading,
  selectedProduct,
  quantity,
  setQuantity,
  setSelectedProduct,
  error,
  products,
  setProducts,
  cart,
  setCart,
  pendingOrders,
  setPendingOrders,
  pendingCustomerRegistration,
  setPendingCustomerRegistration,
  pendingOrderSchedule,
  setPendingOrderSchedule,
  pendingError,
  setPendingError,
  handleAddToCart,
  workBranch,
  workBranchKey,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('All Products');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshingProducts, setRefreshingProducts] = useState(false);
  const [scanMode, setScanMode] = useState(true);
  const [scannedId, setScannedId] = React.useState('');
  const searchRef = React.useRef(null);
  const filterRef = React.useRef(null);
  const searchCustomerRef = React.useRef(null);

  const MAX_ALLOWED_PENDING_ORDERS = 5; // Maximum number of pending orders allowed, can be adjusted as needed

  React.useEffect(() => {
    if (
      workBranch &&
      (activeMenuItem === 'Sales Items' || activeMenuItem === 'Cart')
    ) {
      setScanMode(true);
    }
  }, [activeMenuItem, setScanMode, workBranch]);

  // Filter products based on search term and selected filter
  React.useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        (product.name + product.description + product.category)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); // Check if search term matches name or description
      const matchesFilter =
        filterValue === 'All Products' ||
        product.availabilityStatus === filterValue;
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesFilter && matchesCategory;
    });

    const filteredCategories = [
      ...new Set(filtered.map((product) => product.category)),
    ];
    setProductCategories(filteredCategories);
    setFilteredProducts(filtered);
  }, [searchTerm, filterValue, products, selectedCategory]);

  const handleRefreshProducts = async () => {
    setRefreshingProducts(true);
    setLoading(true);
    const fetchedProducts = await fetchProductsFromAPI();
    setProducts(fetchedProducts);
    setLoading(false);
    setRefreshingProducts(false);
  };

  //listen for barcode scanner
  const handleScan = (e) => {
    if (e.key === 'Enter') {
      const product = products.find((p) => p.barcode === scannedId.trim());
      if (product && !selectedProduct) {
        const noOptions =
          product.components?.length === 1 &&
          product.components[0]?.materialChoices?.length === 1;

        const singleChoice = product.components[0]?.materialChoices[0];

        if (noOptions) {
          handleAddToCart(product, [singleChoice], quantity);
          setActiveMenuItem('Cart');
        } else {
          setSelectedProduct(product);
          setActiveMenuItem('Sales Items');
        }
      }
      setScannedId('');
    }
  };

  // Handle creating pending order
  const handlePendOrder = () => {
    // create a unique ID for the pending order using timestamp and random string
    const pendingOrderId = `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (cart?.items?.length > 0) {
      if (pendingOrders?.length >= MAX_ALLOWED_PENDING_ORDERS) {
        setPendingError(
          'You have reached the maximum limit of 5 pending orders. Please complete or clear existing pending orders before creating new ones.'
        );
        return;
      }
      setPendingOrders((prev) => [
        {
          id: pendingOrderId,
          items: cart?.items,
          linkedCustomer: cart?.linkedCustomer,
        },
        ...prev,
      ]);
      setCart((prev) => ({ ...prev, items: [], linkedCustomer: null })); // Clear cart after creating pending order
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {/*Top search Filters and tools */}
      <div className="p-4 border-b border-gray-border w-full flex flex-row justify-between items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-lg">
        {/* Top Search and filter bar */}
        <div className="flex flex-row items-center">
          {/* Search input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setScanMode(false)}
            onBlur={() => setScanMode(true)}
            ref={searchRef}
            placeholder="Search items name, category or description..."
            className={`w-80 p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
          />

          {/* Available products filter */}
          <select
            className={`ml-4 p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
            value={filterValue}
            ref={filterRef}
            onFocus={() => setScanMode(false)}
            onBlur={() => setScanMode(true)}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="All Products">All Products</option>
            {['in Stock', 'out of Stock', 'low stock', 'discontinued'].map(
              (option) => (
                <option
                  key={option}
                  value={option}
                  className={
                    mode === 'light' ? lightThemeStyle : darkThemeStyle
                  }
                >
                  {option}
                </option>
              )
            )}
          </select>
        </div>

        {/* action buttons */}
        <div className="inline-flex ml-4 space-x-2">
          <button className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/80 relative">
            <span>Pending Orders</span>
            {/* Pending Orders Badge */}
            {pendingOrders?.length > 0 && (
              <motion.div
                className={`absolute -top-1 -right-2 bg-error text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={pendingOrders?.length}
              >
                {pendingOrders?.length}
              </motion.div>
            )}
          </button>
          <button className="px-4 py-2 bg-gray-200 text-text-black rounded-md hover:bg-gray-300">
            <span>Pending Registrations</span>
          </button>
          <button className="px-4 py-2 bg-gray-200 text-text-black rounded-md hover:bg-gray-300">
            Order Schedule
          </button>
        </div>
      </div>

      {/* Sales point products */}
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-md p-4">
          {activeMenuItem === 'Sales Items' && (
            <SalesPointProducts
              scanMode={scanMode}
              setScanMode={setScanMode}
              handleScan={handleScan}
              scannedId={scannedId}
              setScannedId={setScannedId}
              searchRef={searchRef}
              filterRef={filterRef}
              searchCustomerRef={searchCustomerRef}
              products={products}
              filteredProducts={filteredProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              quantity={quantity}
              setQuantity={setQuantity}
              cart={cart}
              productCategories={productCategories}
              setProductCategories={setProductCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleRefreshProducts={handleRefreshProducts}
              refreshingProducts={refreshingProducts}
              loading={loading}
              error={error}
              mode={mode}
              lightThemeStyle={lightThemeStyle}
              darkThemeStyle={darkThemeStyle}
              workBranch={workBranch}
              activeMenuItem={activeMenuItem}
            />
          )}

          {activeMenuItem === 'Cart' && (
            <Cart
              products={products}
              cart={cart}
              setCart={setCart}
              handleScan={handleScan}
              handlePendOrder={handlePendOrder}
              scannedId={scannedId}
              setScannedId={setScannedId}
              workBranch={workBranch}
              scanMode={scanMode}
              setScanMode={setScanMode}
              searchRef={searchRef}
              filterRef={filterRef}
              searchCustomerRef={searchCustomerRef}
              setActiveMenuItem={setActiveMenuItem}
              mode={mode}
              lightThemeStyle={lightThemeStyle}
              darkThemeStyle={darkThemeStyle}
              handleAddToCart={handleAddToCart}
              workBranchKey={workBranchKey}
            />
          )}

          {activeMenuItem === 'Customers' && <Customers />}

          {activeMenuItem === 'Payments' && <Payments />}
        </div>
      </div>
    </div>
  );
};

export default SalesPointContent;
