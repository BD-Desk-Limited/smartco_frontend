import React, { useState, useRef, useEffect } from 'react';
import CustomerLookUp from './CustomerLookUp';
import CartProductList from './CartProductList';
import CustomerLinkForm from './CustomerLinkForm';
import LinkedCustomer from './LinkedCustomer';
import BillAndSummary from './BillAndSummary';
import { getCustomerByCustomerNumberEmailOrPhoneService } from '@/services/customerServices';

const Cart = ({
  products,
  cart,
  setCart,
  setActiveMenuItem,
  handleScan,
  handlePendOrder,
  handleCheckout,
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
  const [isHydrated, setIsHydrated] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerData, setCustomerData] = useState({});
  const [linkedCustomerData, setLinkedCustomerData] = useState({});
  const [isOpenCustomerOverlay, setIsOpenCustomerOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerFetchError, setCustomerFetchError] = useState('');
  const [awaitingScanForCustomer, setAwaitingScanForCustomer] = useState(false);
  const [appliedOffers, setAppliedOffers] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const workBranchVATRate =
    workBranch && workBranch.taxBand?.rates[0]?.rate
      ? workBranch.taxBand.rates[0].rate
      : 0;

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
  }, [scanMode, workBranch, cart?.items]);

  // cleanup function to reset scan mode when component unmounts
  useEffect(() => {
    return () => {
      setScanMode(true);
    };
  }, [setScanMode]);

  console.log('Cart from schedule:', cart.payment);
  // if cart is empty, switch to sales items tab
  useEffect(() => {
    if (cart?.items?.length === 0 || cart?.items === undefined) {
      setActiveMenuItem('sales-items');
    }
  }, [cart?.items, setActiveMenuItem]);

  const handleCustomerSearch = async (e) => {
    e.preventDefault();
    if (customerSearchTerm.trim() === '' || loading) return;

    try {
      setLoading(true);

      //fetch customer data, using searchterm
      setIsOpenCustomerOverlay(true);
      setLoading(true);
      setCustomerFetchError('');

      //if offline, show error message saying customer data cannot be fetched while offline
      if (!navigator.onLine) {
        setCustomerFetchError(
          'Sorry, cannot fetch customer data while offline.'
        );
      }
      //validate search term to allow only text, numbers, ., - and + for phone numbers, and @ for emails
      const validSearchTerm = /^[a-zA-Z0-9@.,+\-]+$/.test(customerSearchTerm);
      if (!validSearchTerm) {
        setCustomerFetchError('Invalid search term. Please try again.');
        console.log('Invalid search term:', customerSearchTerm);
        return;
      }

      const response =
        await getCustomerByCustomerNumberEmailOrPhoneService(
          customerSearchTerm
        );

      if (response && response.data) {
        setCustomerData(response.data);
        setCustomerFetchError('');
        setCustomerSearchTerm('');
      }
      if (response && response.error) {
        setCustomerData({});
        setCustomerFetchError(response.error);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
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
    setCustomerSearchTerm('');
    setScanMode(true);
  };

  //update linked customer state whenever cart's linkedCustomer changes
  useEffect(() => {
    setLinkedCustomerData(cart.linkedCustomer || {});
  }, [cart.linkedCustomer]);

  const handleUnlinkCustomer = () => {
    setCustomerData({});
    setCart((prevCart) => ({ ...prevCart, linkedCustomer: null }));
    setCustomerFetchError('');
    setAppliedOffers([]);
  };

  const handleOptionAdditionalCost = (item) => {
    const optionAdditionalCost = item?.choices?.reduce((acc, obj) => {
      const additionalCost = obj.choice?.additionalPrice || 0;
      return acc + additionalCost;
    }, 0);
    return optionAdditionalCost;
  };

  const itemUnitCost = (item) => {
    const basePrice = item?.product?.price || 0;
    const itemTotalPrice = basePrice + handleOptionAdditionalCost(item);
    return itemTotalPrice;
  };

  const itemTotalCost = (item) => {
    const unitCost = itemUnitCost(item);
    const totalCost = unitCost * item?.quantity;
    return totalCost;
  };

  const productItemTax = (item) => {
    const taxableTaxRate = item?.product?.productTax?.baseTax || 0;
    const additionalTaxAmount =
      item?.product?.productTax?.additionalTaxAmount || 0;
    const unitCost = itemUnitCost(item);
    const taxAmount = (unitCost * taxableTaxRate) / 100;
    return taxAmount + additionalTaxAmount;
  };

  const productsTax = (cartItems) =>
    cartItems?.reduce((acc, item) => {
      return acc + productItemTax(item) * item.quantity;
    }, 0);

  const subtotal = (cartItems) =>
    cartItems?.reduce((acc, item) => {
      return acc + itemTotalCost(item);
    }, 0);

  const taxfreeProduct = (item) => {
    return item?.product?.productTax?.isTaxExcluded || false;
  };

  if (!isHydrated) {
    return null;
  }

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

      <div
        className={`h-full w-full rounded-lg ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
      >
        {cart?.items?.length === 0 ? (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
          >
            <p className="text-lg font-semibold">Your cart is empty</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-row items-center justify-center">
            <div className="w-3/5 h-full rounded-lg mx-3 flex flex-col relative">
              {/* Customer look-up/linking section */}
              {linkedCustomerData &&
              Object.keys(linkedCustomerData).length > 0 &&
              linkedCustomerData._id ? (
                <LinkedCustomer
                  cart={cart}
                  handleUnlinkCustomer={handleUnlinkCustomer}
                  linkedCustomerData={linkedCustomerData}
                  setIsOpenCustomerOverlay={setIsOpenCustomerOverlay}
                  mode={mode}
                  lightThemeStyle={lightThemeStyle}
                  darkThemeStyle={darkThemeStyle}
                />
              ) : (
                <CustomerLinkForm
                  handleCustomerSearch={handleCustomerSearch}
                  customerSearchTerm={customerSearchTerm}
                  setCustomerSearchTerm={setCustomerSearchTerm}
                  setScanMode={setScanMode}
                  searchCustomerRef={searchCustomerRef}
                  mode={mode}
                  lightThemeStyle={lightThemeStyle}
                  darkThemeStyle={darkThemeStyle}
                  handleOpenOverlayForScanning={handleOpenOverlayForScanning}
                />
              )}
              {/* Cart items list */}
              <CartProductList
                cart={cart}
                setCart={setCart}
                mode={mode}
                lightThemeStyle={lightThemeStyle}
                darkThemeStyle={darkThemeStyle}
                productItemTax={productItemTax}
                itemTotalCost={itemTotalCost}
                itemUnitCost={itemUnitCost}
                taxfreeProduct={taxfreeProduct}
              />
            </div>

            {/* Bill summary and offers section */}
            <div className="w-2/5 h-full">
              <BillAndSummary
                linkedCustomerData={linkedCustomerData}
                productsTax={productsTax}
                subtotal={subtotal}
                cartItems={cart?.items}
                handlePendOrder={handlePendOrder}
                handleCheckout={handleCheckout}
                workBranchVATRate={workBranchVATRate}
                taxfreeProduct={taxfreeProduct}
                itemUnitCost={itemUnitCost}
                showButtons={true}
                mode={mode}
                total={total}
                setTotal={setTotal}
                lightThemeStyle={lightThemeStyle}
                darkThemeStyle={darkThemeStyle}
              />
            </div>
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
            cart={cart}
            setCart={setCart}
            mode={mode}
            lightThemeStyle={lightThemeStyle}
            darkThemeStyle={darkThemeStyle}
            setIsOpenCustomerOverlay={setIsOpenCustomerOverlay}
            handleClose={handleClose}
            loading={loading}
            appliedOffers={appliedOffers}
            setAppliedOffers={setAppliedOffers}
            customerData={customerData}
            linkedCustomerData={linkedCustomerData}
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
