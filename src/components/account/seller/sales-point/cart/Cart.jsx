import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBarcode } from 'react-icons/fa';
import CustomerLookUp from './CustomerLookUp';
import { fetchCustomerData } from './sampleData';

const Cart = ({
  products,
  cartItems,
  setCartItems,
  setActiveMenuItem,
  handleScan,
  scannedId,
  setScannedId,
  scanMode,
  setScanMode,
  searchRef,
  filterRef,
  searchCustomerRef,
  workBranch,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const inputRef = useRef(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerData, setCustomerData] = useState({});
  const [isOpenCustomerOverlay, setIsOpenCustomerOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerFetchError, setCustomerFetchError] = useState('');
  const [awaitingScanForCustomer, setAwaitingScanForCustomer] = useState(false);

  // always focus scanMode
  useEffect(() => {
    if (!scanMode || !workBranch) return;

    const focusScannerInput = () => {
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    };

    const timeoutId = window.setTimeout(focusScannerInput, 0);
    window.addEventListener('focus', focusScannerInput);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('focus', focusScannerInput);
    };
  }, [scanMode, workBranch, cartItems]);

  useEffect(() => {
    return () => {
      setScanMode(true);
    };
  }, [setScanMode]);

  // if cart is empty, switch to sales items
  useEffect(() => {
    if (cartItems.length === 0) {
      setActiveMenuItem('Sales Items');
    }
  }, [cartItems, setActiveMenuItem]);

  const handleCustomerSearch = async (e) => {
    e.preventDefault();
    if (customerSearchTerm.trim() === '' || loading) return;

    try {
      //fetch customer data, using searchterm
      setIsOpenCustomerOverlay(true);
      setLoading(true);
      setCustomerFetchError('');

      const response = await fetchCustomerData(customerSearchTerm);

      if (response && response.data) {
        setCustomerData(response.data);
        setCustomerFetchError('');
        setCustomerSearchTerm('');
      }
      if (response && response.error) {
        setCustomerFetchError(response.error);
      }
    } catch (err) {
      setCustomerFetchError(
        'Failed to fetch customer data. Please try again later.'
      );
    } finally {
      setLoading(false);
      setCustomerSearchTerm('');
      setAwaitingScanForCustomer(false);
    }
  };

  const handleOpenOverlayForScanning = () => {
    searchCustomerRef.current?.focus();
    setCustomerSearchTerm('');
    setCustomerData({});
    setCustomerFetchError('');
    setIsOpenCustomerOverlay(true);
    setAwaitingScanForCustomer(true);
  };

  const handleClose = () => {
    setAwaitingScanForCustomer(false);
    setIsOpenCustomerOverlay(false);
    setCustomerFetchError('');
    setCustomerData({});
    setCustomerSearchTerm('');
    setScanMode(true);
  };

  console.log('CART:', cartItems);

  return (
    <div className="h-full rounded-lg">
      {/*Hidden Scanner input */}
      <input
        type="text"
        value={scannedId}
        onChange={(e) => setScannedId(e.target.value)}
        onKeyDown={handleScan}
        ref={inputRef}
        onBlur={(e) => {
          if (
            scanMode &&
            e.relatedTarget !== searchRef.current &&
            e.relatedTarget !== filterRef.current &&
            e.relatedTarget !== searchCustomerRef.current
          ) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        style={{ position: 'absolute', left: '-9999px' }}
      />

      <div>
        {cartItems.length === 0 ? (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
          >
            <p className="text-lg font-semibold">Your cart is empty</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-row items-center justify-center">
            {/* Cart items list */}
            <div className="w-3/5 h-full rounded-lg mx-3 flex flex-col relative">
              {/* Customer look-up/linking section */}
              <form
                onSubmit={handleCustomerSearch}
                className="p-2 border-b border-gray-border w-full flex flex-row gap-5 items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-lg"
              >
                <div className="flex flex-col font-semibold">
                  <span>Link a customer to this order</span>
                  <p className={`w-full flex flex-row items-center py-1`}>
                    <input
                      type="text"
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      onFocus={() => setScanMode(false)}
                      onBlur={(e) => {
                        if (!e.currentTarget.form?.contains(e.relatedTarget)) {
                          setScanMode(true);
                        }
                      }}
                      ref={searchCustomerRef}
                      placeholder="Search customer ID, name or email..."
                      className={`w-80 bg-inherit p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green`}
                    />
                    <button
                      type="submit"
                      className="bg-gray-shadow6 rounded-md p-3 ml-2 flex items-center justify-center hover:bg-gray-shadow5 transition-colors duration-200"
                    >
                      <FaSearch className="text-lg" />
                    </button>
                  </p>
                </div>
                <span>or</span>

                {/* scan customer card button */}
                <button
                  type="submit"
                  className={`p-2 border border-gray-border rounded-md ${mode === 'light' ? lightThemeStyle : darkThemeStyle} hover:bg-gray-shadow8 transition-colors duration-200 flex flex-col items-center justify-center`}
                  onClick={handleOpenOverlayForScanning}
                >
                  <span className="flex flex-row items-center gap-1 mb-1 scale-105 w-full justify-center">
                    <FaBarcode className="text-lg" />
                    <FaBarcode className="text-lg" />
                    <FaBarcode className="text-lg" />
                    <FaBarcode className="text-lg" />
                  </span>
                  <span className="text-text-gray font-semi-bold">
                    Scan customer card
                  </span>
                </button>
              </form>
            </div>
            <div className="w-2/5 bg-text-white h-full rounded-lg mx-3">b</div>
          </div>
        )}
      </div>

      {isOpenCustomerOverlay && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 `}
          onClick={handleClose}
        >
          <CustomerLookUp
            products={products}
            mode={mode}
            lightThemeStyle={lightThemeStyle}
            darkThemeStyle={darkThemeStyle}
            setIsOpenCustomerOverlay={setIsOpenCustomerOverlay}
            handleClose={handleClose}
            loading={loading}
            customerData={customerData}
            customerFetchError={customerFetchError}
            setCustomerData={setCustomerData}
            setCustomerFetchError={setCustomerFetchError}
            awaitingScanForCustomer={awaitingScanForCustomer}
            setAwaitingScanForCustomer={setAwaitingScanForCustomer}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
