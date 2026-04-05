import React, { useState } from 'react';
import { useNotification } from '@/contexts/notificationContext';
import SalesPointProducts from '../sales-items/SalesPointProducts';
import { fetchProductsFromAPI } from '../productFetchManagement';
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
  filterRef,
  filterValue,
  searchRef,
  searchTerm,
  scanMode,
  setScanMode,
  cart,
  setCart,
  pendingOrders,
  setPendingOrders,
  MAX_ALLOWED_PENDING_ORDERS,
  handleAddToCart,
  workBranch,
  workBranchKey,
}) => {
  const { showNotification } = useNotification();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshingProducts, setRefreshingProducts] = useState(false);
  const [scannedId, setScannedId] = React.useState('');
  const searchCustomerRef = React.useRef(null);

  React.useEffect(() => {
    if (
      workBranch &&
      (activeMenuItem === 'sales-items' || activeMenuItem === 'cart')
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
          setActiveMenuItem('cart');
        } else {
          setSelectedProduct(product);
          setActiveMenuItem('sales-items');
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
        showNotification(
          'error',
          'Limit Reached',
          'You have reached the maximum limit of 5 pending orders. Please complete or clear existing pending orders before creating new ones.',
          4000
        );
        return;
      }
      setPendingOrders((prev) => [
        {
          id: pendingOrderId,
          items: cart?.items,
          linkedCustomer: cart?.linkedCustomer,
          pendTime: new Date().toISOString(),
        },
        ...prev,
      ]);
      setCart((prev) => ({ ...prev, items: [], linkedCustomer: null })); // Clear cart after creating pending order

      // Show success notification
      showNotification(
        'success',
        'Order Pending',
        `${cart?.items?.length} item(s) saved as pending order`,
        3000
      );
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Sales point products */}
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-md p-4">
          {activeMenuItem === 'sales-items' && (
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

          {activeMenuItem === 'cart' && (
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

          {activeMenuItem === 'customers' && <Customers />}

          {activeMenuItem === 'payments' && <Payments />}
        </div>
      </div>
    </div>
  );
};

export default SalesPointContent;
