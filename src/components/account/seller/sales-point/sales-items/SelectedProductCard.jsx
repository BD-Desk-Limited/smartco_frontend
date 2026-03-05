import Button from '@/components/account/Button';
import Image from 'next/image';
import React from 'react';
import {
  FaShoppingCart,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';

const SelectedProductCard = ({
  product,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const [quantity, setQuantity] = React.useState(1);

  return (
    <li
      className={`h-fit max-w-64 rounded-xl shadow-sm flex flex-col items-center p-0.5 cursor-pointer ${mode === 'light' ? 'bg-gray-shadow9' : 'bg-gray-shadow1'} `}
    >
      <div className={`w-full rounded-xl`}>
        <Image
          src={product.imageURL}
          alt={product.name}
          title={product.name}
          width={1000}
          height={100}
          className="w-full h-40 object-fill rounded-t-xl rounded-b-none"
        />
      </div>
      <div
        className={`w-full h-full rounded-b-xl px-2 ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
      >
        <span
          className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-row justify-between text-sm py-2 border-b`}
        >
          <span className="">{product?.name?.substring(0, 20)}...</span>
          <span className="ml-5 font-semibold">
            {product?.currency}
            {product?.price?.toFixed(2)}
          </span>
        </span>
        <p
          className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-col justify-center text-xs p-2 border-b font-light max-h-24 overflow-y-auto scrollbar-thin`}
        >
          <span className="text-center">{product?.name}</span>
          <span className="">{product?.description}</span>
        </p>
        <p
          className={`${mode === 'light' ? 'border-gray-shadow9' : 'border-gray-shadow1'} w-full flex flex-row justify-between text-sm py-3 border-b`}
        >
          <span className={`font-semibold`}>Availability</span>
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

        <p
          className={`${mode === 'light' ? `${lightThemeStyle} border-gray-shadow9` : `${darkThemeStyle} border-gray-shadow1`} w-full flex flex-row justify-between items-center text-sm py-3 border-b`}
        >
          <span className={`font-semibold mr-5`}>Quantity</span>
          <span className={`flex flex-row items-center space-x-0`}>
            <Button
              text={`-`}
              buttonStyle={`font-bold text-lg bg-brand-green hover:bg-green-shadow1`}
              onClick={() => setQuantity(Math.max(1, quantity - 1) || '')}
            />

            <input
              type="text"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)) || '0')
              }
              className={`w-16 text-center text-base font-bold text-brand-green bg-transparent rounded-md outline-none [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden`}
            />

            <Button
              text={`+`}
              buttonStyle={`font-bold text-lg bg-brand-green hover:bg-green-shadow1`}
              onClick={() => setQuantity(parseInt(quantity) + 1)}
            />
          </span>
        </p>

        {/* Add to cart button */}
        <div className="w-full flex justify-center mt-2">
          <Button
            buttonStyle={`bg-brand-green hover:bg-green-shadow1 rounded-md p-2 w-full mx-1 text-sm flex items-center justify-center mb-3 h-fit
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
  );
};

export default SelectedProductCard;
