import Image from 'next/image';
import React from 'react';
import {
  FaExpeditedssl,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaTrashAlt,
} from 'react-icons/fa';

const CartProductList = ({
  cartItems,
  setCartItems,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
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
    const totalCost = unitCost * item.quantity;
    return totalCost.toFixed(2);
  };

  const handleQuantityIncrease = (item) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.cartItemId === item.cartItemId
          ? { ...cartItem, quantity: Number(cartItem.quantity) + 1 }
          : cartItem
      )
    );
  };

  const handleQuantityDecrease = (item) => {
    if (item.quantity === 1) return; // prevent quantity from going below 1
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.cartItemId === item.cartItemId
          ? { ...cartItem, quantity: Number(cartItem.quantity) - 1 }
          : cartItem
      )
    );
  };

  return (
    <div
      className={`p-1 flex-1 overflow-y-auto max-h-[50vh] scrollbar-thin ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
    >
      {/* List of cart items, using combination of _id and isPromo flag as key to avoid key conflicts for promo items that are also same as a regular item in the cart */}
      {cartItems?.map((item) => (
        <div
          key={item.cartItemId}
          className={`mb-2 rounded-sm p-1 flex items-center gap-2 shadow-md ${mode === 'light' ? 'bg-gray-shadow10' : 'bg-gray-shadow1'}`}
        >
          <div className="flex items-center gap-4">
            {item.product?.imageURL ? (
              <Image
                src={item.product?.imageURL}
                alt={item.product?.name || 'product Image'}
                width={50}
                height={50}
                className="w-12 h-12 object-cover rounded shadow-sm"
              />
            ) : (
              <FaShoppingBag
                className={`w-12 h-12 text-gray-500 ${mode === 'light' ? 'bg-gray-shadow7' : 'bg-gray-shadow8'} rounded`}
              />
            )}
          </div>

          <div className="flex-1 flex-col items-start gap-1">
            <p className="font-semibold text-base">{item.product?.name}</p>
            {/* choices display until width is exhausted */}
            <p className="text-sm">
              {item.choices
                ?.map((obj, idx) => obj.choice?.material?.name)
                .join(', ')
                .slice(0, 50)}
            </p>

            {/* Quantity controls */}
            <div className={`flex flex-row items-center gap-4 my-1`}>
              <span className="text-sm font-semibold">Quantity</span>
              <button
                className="hover:bg-green-shadow1 transition-colors duration-200 bg-brand-green rounded-md px-1 py-1"
                onClick={() => handleQuantityDecrease(item)}
              >
                <FaMinus className={`text-sm text-white`} />
              </button>
              <span className="font-semibold text-brand-green">
                {item.quantity}
              </span>
              <button
                className="hover:bg-green-shadow1 transition-colors duration-200 bg-brand-green rounded-md px-1 py-1"
                onClick={() => handleQuantityIncrease(item)}
              >
                <FaPlus className={`text-sm text-white`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="font-bold">
              {item?.product?.currency}
              {itemTotalCost(item)}
            </p>
            <p className="text-sm">
              {item.quantity} x {item?.product?.currency}
              {itemUnitCost(item)}
            </p>

            {/* Delete button */}
            <button className="hover:animate-pulse cursor-pointer p-1 hover:bg-gray-shadow7 rounded transition-colors duration-200">
              <FaTrashAlt
                className={` text-error transition-transform duration-100`}
                onClick={() =>
                  setCartItems((prev) =>
                    prev.filter((cartItem) => cartItem !== item)
                  )
                }
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartProductList;
