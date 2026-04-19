import { useState, useRef, useEffect } from 'react';
import Spinner from '../../../Spinner';
import ErrorInterface from '../../../errorInterface';
import Button from '../../../Button';
import Image from 'next/image';
import {
  FaShoppingCart,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';

const SalesPointProducts = ({
  products,
  filteredProducts,
  selectedProduct,
  setSelectedProduct,
  cart,
  loading,
  error,
  productCategories,
  selectedCategory,
  setSelectedCategory,
  handleRefreshProducts,
  handleScan,
  scannedId,
  setScannedId,
  refreshingProducts,
  scanMode,
  searchRef,
  filterRef,
  searchCustomerRef,
  workBranch,
  mode,
  activeMenuItem,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const inputRef = useRef(null);
  // Track whether the scanner has been focused at least once since mount.
  // On the very first focus attempt the page may still be stabilising (products
  // loading, context hydrating, branch modals closing), so we use a longer delay
  // to let all that settle. Subsequent refocuses (e.g. returning from the search
  // bar) use 0ms so they feel instant.
  const hasFocusedRef = useRef(false);

  // always focus scanMode
  useEffect(() => {
    if (
      loading ||
      error ||
      !scanMode ||
      activeMenuItem !== 'sales-items' ||
      !workBranch ||
      selectedProduct
    ) {
      return;
    }

    const focusScannerInput = () => {
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    };

    const delay = hasFocusedRef.current ? 0 : 300;
    hasFocusedRef.current = true;

    const timeoutId = window.setTimeout(focusScannerInput, delay);
    window.addEventListener('focus', focusScannerInput);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('focus', focusScannerInput);
    };
  }, [
    loading,
    error,
    scanMode,
    activeMenuItem,
    workBranch,
    selectedProduct,
    cart?.items,
  ]);

  const handleProductClick = (product) => {
    if (product.availabilityStatus !== 'in stock') return; // Prevent selection if product is not in stock
    setSelectedProduct(product);
  };

  const isProductInCart = (productId) => {
    let checkResult = {
      status: false,
      quantity: 0,
    };
    const productIsInCart =
      cart?.items?.length > 0 &&
      cart?.items?.filter((item) => item.product?._id === productId);
    if (productIsInCart && productIsInCart.length > 0) {
      //add quantities of the same product in cart
      const totalQuantity = productIsInCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      checkResult = {
        status: true,
        quantity: totalQuantity,
      };
    }
    return checkResult;
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="w-full h-full flex flex-col items-center justify-center py-10 ">
          <ErrorInterface error={error} />
        </div>
      ) : (
        <div className="">
          {/* Scanner input */}
          <input
            type="text"
            value={scannedId}
            onChange={(e) => setScannedId(e.target.value)}
            onKeyDown={handleScan}
            ref={inputRef}
            onBlur={(e) => {
              if (
                scanMode &&
                !selectedProduct &&
                e.relatedTarget !== searchRef.current &&
                e.relatedTarget !== filterRef.current &&
                e.relatedTarget !== searchCustomerRef.current
              ) {
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }}
            style={{ position: 'absolute', left: '-9999px' }}
          />
          {/* Product categories list */}
          <div className="w-full flex flex-row items-center justify-between px-4">
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-row items-center gap-4 w-full overflow-x-auto no-scrollbar">
                <div className="flex flex-row gap-2 mb-3">
                  <span
                    onClick={() => setSelectedCategory('All')}
                    className={` ${selectedCategory === 'All' ? 'bg-green-shadow7' : ' '} text-text-black p-3 mr-3 rounded-lg text-base font-semibold hover:bg-green-shadow8 cursor-pointer sticky left-0 bg-gray-shadow9`}
                  >
                    All
                  </span>
                  <span className="flex flex-row items-center gap-2 text-nowrap">
                    {productCategories.map((category) => (
                      <span
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={` ${selectedCategory === category ? 'bg-green-shadow7 text-text-black' : ''} p-3 rounded-md text-base font-semibold hover:bg-green-shadow8 cursor-pointer`}
                      >
                        {category}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            )}

            {/* Refresh products button */}
            <div className="bg-brand-green text-text-white rounded-r-xl rounded-l-none cursor-pointer text-nowrap  ml-3">
              <Button
                text={refreshingProducts ? 'Refreshing...' : 'Refresh Products'}
                onClick={handleRefreshProducts}
                loading={refreshingProducts}
                buttonStyle="bg-brand-green hover:bg-green-shadow2 rounded-r-xl rounded-l-none text-text-white"
              />
            </div>
          </div>

          {/* Product list */}
          {filteredProducts && filteredProducts.length > 0 ? (
            <ul className="w-full h-[calc(100vh-250px)] mb-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 scrollbar-thin overflow-y-auto">
              {filteredProducts.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className={`
                    max-h-72 max-w-52 rounded-xl shadow-sm flex flex-col items-center p-0.5 cursor-pointer hover:border hover:border-brand-green relative ${
                      mode === 'light' ? 'bg-gray-shadow9' : 'bg-gray-shadow1'
                    } 
                  `}
                >
                  {/* if product is already in cart, show "In Cart" badge and quantity */}
                  {isProductInCart(product._id).status && (
                    <div className="absolute top-0 w-full bg-error text-text-white text-base px-2 py-1 rounded-t-lg flex items-center gap-1 animate-pulse">
                      <FaCheckCircle className="text-base" />
                      {isProductInCart(product._id).quantity} In Cart
                    </div>
                  )}

                  <div className={`w-full rounded-xl`}>
                    <Image
                      src={product.imageURL}
                      alt={product.name}
                      title={product.name}
                      width={1000}
                      height={100}
                      className="w-full h-32 object-fill rounded-t-xl rounded-b-none"
                    />
                  </div>
                  <div
                    className={`w-full h-full rounded-b-xl px-1 ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
                  >
                    <span
                      className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-row justify-between text-sm py-2 border-b`}
                    >
                      <span className="font-semibold">
                        {product?.name?.substring(0, 25)}...
                      </span>
                      <span className="ml-5">
                        {product?.currency}
                        {product?.price}
                      </span>
                    </span>
                    <p
                      className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-row justify-between text-sm py-2 border-b`}
                    >
                      <span className="">Availability</span>
                      <span
                        className={` ${product?.availabilityStatus === 'in stock' ? 'text-brand-green' : 'text-error'} flex flex-row font-semibold text-sm`}
                      >
                        {product?.availabilityStatus === 'in stock' ? (
                          <FaCheckCircle className={`mr-1 text-brand-green`} />
                        ) : (
                          <FaExclamationCircle className={`mr-1 text-error`} />
                        )}
                        {product?.availabilityStatus === 'in stock'
                          ? 'Available'
                          : product.availabilityStatus}
                      </span>
                    </p>
                    {/* Add to cart button */}
                    <div className="w-full flex justify-center mt-2">
                      <Button
                        buttonStyle={` 
                          ${mode !== 'light' ? 'bg-gray-shadow1 hover:bg-gray-shadow2' : 'bg-white hover:bg-gray-shadow8'} 
                          rounded-md p-2 w-full mx-1 text-sm flex items-center justify-center mb-3 h-fit
                          ${product.availabilityStatus !== 'in stock' ? 'cursor-not-allowed opacity-20' : ''}
                        `}
                      >
                        <FaShoppingCart
                          className={`${mode !== 'light' ? 'text-text-white' : 'text-text-black'} mr-1`}
                        />
                        <span
                          className={`${mode !== 'light' ? 'text-text-white' : 'text-text-black'} font-normal`}
                        >
                          Add to Cart
                        </span>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center py-10 text-text-gray">
              {products && products.length > 0 ? (
                <>
                  <strong>Oops!!!</strong>
                  <p>
                    No match found for your search. Please try again with
                    different keywords.
                  </p>
                </>
              ) : (
                <>
                  <strong>Oops!!!</strong>
                  <p>
                    No products available in your store. Please contact your
                    administrator.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SalesPointProducts;
