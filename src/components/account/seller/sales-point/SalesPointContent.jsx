import React, { useState } from 'react';
import { useNotification } from '@/contexts/notificationContext';
import SalesPointProducts from './sales-items/SalesPointProducts';
import { fetchProductsFromAPI } from './productFetchManagement';
import Cart from './cart/Cart';
import Payment from './payment/Payment';

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
  handleCheckout,
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

  // Handle pending order
  const handlePendOrder = () => {
    // create a unique ID for the pending order using timestamp and random string
    const orderId = `ID-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
          ...cart,
          orderId: cart?.orderId || orderId,
          pendTime: cart?.pendTime || new Date().toISOString(),
        },
        ...prev,
      ]);
      setCart({ items: [] }); // Clear cart after creating pending order

      // Show success notification
      showNotification(
        'success',
        'Order Pending',
        `${cart?.items?.length} item(s) saved as pending order`,
        3000
      );
    } else {
      showNotification('error', 'No Items in Cart', ' ', 3000);
    }
  };

  const SHARED_PROPS = {
    scanMode,
    setScanMode,
    handleScan,
    scannedId,
    setScannedId,
    searchRef,
    filterRef,
    searchCustomerRef,
    products,
    filteredProducts,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    productCategories,
    setProductCategories,
    selectedCategory,
    setSelectedCategory,
    handleRefreshProducts,
    refreshingProducts,
    loading,
    error,
    mode,
    lightThemeStyle,
    darkThemeStyle,
    activeMenuItem,
    cart,
    setCart,
    handlePendOrder,
    handleCheckout,
    workBranch,
    setActiveMenuItem,
    handleAddToCart,
    workBranchKey,
  };

  // map active menu item to content component - if no match, default to sales point products to allow dynamic switching between numerous stages of sales point without losing state of products, cart, etc
  const CONTENT_COMPONENT_MAP = {
    'sales-items': SalesPointProducts,
    cart: Cart,
    payment: Payment,
  };

  const ActiveContentComponent =
    CONTENT_COMPONENT_MAP[activeMenuItem] || SalesPointProducts;

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Sales point products */}
      <div className="flex-1 p-4">
        <div className="w-full h-full rounded-md p-4">
          {/* Dynamically render the active content component based on the selected menu item */}
          <ActiveContentComponent {...SHARED_PROPS} />
        </div>
      </div>
    </div>
  );
};

export default SalesPointContent;
