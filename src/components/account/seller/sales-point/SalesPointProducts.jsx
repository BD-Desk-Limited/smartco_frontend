import React from 'react';
import Spinner from '../../Spinner';
import ErrorInterface from '../../errorInterface';
import Button from '../../Button';
import Image from 'next/image';
import {
  FaShoppingCart,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';

const SalesPointProducts = ({
  products,
  filteredProducts,
  loading,
  error,
  productCategories,
  selectedCategory,
  setSelectedCategory,
  handleRefreshProducts,
  refreshingProducts,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const handleAddToCart = (product) => {
    // Implement the logic to add the product to the cart
    console.log('Adding to cart:', product);
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
          {/* Product categories list */}
          <div className="w-full flex flex-row items-center justify-between px-4">
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-row items-center gap-4 w-full overflow-x-auto scrollbar-none">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    onClick={() => setSelectedCategory('All')}
                    className={` ${selectedCategory === 'All' ? 'bg-green-shadow7 text-text-black' : ''} p-3 rounded-lg text-base font-semibold hover:bg-green-shadow8 cursor-pointer`}
                  >
                    All
                  </span>
                  {productCategories.map((category) => (
                    <span
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={` ${selectedCategory === category ? 'bg-green-shadow7 text-text-black' : ''} p-3 rounded-md text-base font-semibold hover:bg-green-shadow8 cursor-pointer`}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Refresh products button */}
            <div className="bg-brand-green text-text-white rounded-r-xl rounded-l-none cursor-pointer text-nowrap">
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
                  className={` rounded-xl shadow-sm flex flex-col items-center p-0.5 cursor-pointer hover:border hover:border-brand-green ${mode === 'light' ? 'bg-gray-shadow9' : 'bg-gray-shadow1'} `}
                >
                  <div className={`w-full rounded-xl`}>
                    <Image
                      src={product.imageURL}
                      alt={product.name}
                      width={1000}
                      height={100}
                      className="w-full h-32 object-fill rounded-t-xl rounded-b-none"
                    />
                  </div>
                  <div
                    className={`w-full rounded-b-xl px-1 ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
                  >
                    <span
                      className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-row justify-between text-sm py-2 border-b`}
                    >
                      <span>{product?.name}</span>
                      <span>
                        {product?.currency}
                        {product?.price}
                      </span>
                    </span>
                    <p
                      className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-row justify-between text-sm py-2 border-b`}
                    >
                      <span className="">Availability</span>
                      <span
                        className={` ${product?.availabilityStatus === 'in Stock' ? 'text-brand-green' : 'text-error'} flex flex-row font-semibold text-sm`}
                      >
                        {product?.availabilityStatus === 'in Stock' ? (
                          <FaCheckCircle className={`mr-1 text-brand-green`} />
                        ) : (
                          <FaExclamationCircle className={`mr-1 text-error`} />
                        )}
                        {product?.availabilityStatus === 'in Stock'
                          ? 'Available'
                          : product.availabilityStatus}
                      </span>
                    </p>
                    {/* Add to cart button */}
                    <div className="w-full flex justify-center mt-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        buttonStyle={` 
                          ${mode !== 'light' ? 'bg-gray-shadow1 hover:bg-gray-shadow2' : 'bg-white hover:bg-gray-shadow8'} 
                          rounded-md p-2 w-full mx-1 text-sm flex items-center justify-center mb-3 h-fit
                          ${product.availabilityStatus !== 'in Stock' ? 'cursor-not-allowed opacity-20' : ''}
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
