import Image from 'next/image';
import React from 'react';
import { useNotification } from '@/contexts/notificationContext';
import {
  FaExpeditedssl,
  FaMinus,
  FaMoneyCheckAlt,
  FaPlus,
  FaShoppingBag,
  FaTrashAlt,
} from 'react-icons/fa';
import { warning } from 'framer-motion';

const CartProductList = ({
  cart,
  setCart,
  itemTotalCost,
  itemUnitCost,
  productItemTax,
  taxfreeProduct,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const { showNotification } = useNotification();
  const handleQuantityIncrease = (item) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((cartItem) =>
        cartItem.cartItemId === item.cartItemId
          ? { ...cartItem, quantity: Number(cartItem.quantity) + 1 }
          : cartItem
      ),
    }));
  };

  const handleQuantityDecrease = (item) => {
    if (item.quantity === 1) return; // prevent quantity from going below 1
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((cartItem) =>
        cartItem.cartItemId === item.cartItemId
          ? { ...cartItem, quantity: Number(cartItem.quantity) - 1 }
          : cartItem
      ),
    }));
  };

  const handleRemoveFromCart = (item) => {
    // if item has been paid for, prevent removal and show alert
    if (
      cart?.payment?.paymentStatus?.amountPaid > 0 ||
      cart?.payment?.paymentStatus?.value === 'success'
    ) {
      showNotification(
        'warning',
        'Item Removal',
        'This item has been paid for and cannot be removed.',
        3000
      );
      return;
    }

    // If it's the last item in the cart, clear the cart entirely
    if (cart?.items?.length === 1) {
      setCart({
        items: [],
      }); // Clear cart if it's the last item
      return;
    }
    // Remove the item from the cart if there are multiple items
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((cartItem) => cartItem !== item),
    }));
  };

  return (
    <div
      className={`p-1 ml-5 flex-1 overflow-y-auto max-h-[50vh] scrollbar-thin ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
    >
      {/* List of cart items */}
      {cart?.items?.map((item, index) => (
        <div
          key={item.cartItemId}
          className={`mb-2 border-y rounded-sm p-1 flex items-center gap-2 ${mode === 'light' ? 'bg-gray-shadow10' : 'bg-gray-shadow1'}`}
        >
          <span className="text-sm pr-2">{index + 1}</span>
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
                onClick={() => handleQuantityDecrease(item)?.toFixed(2)}
              >
                <FaMinus className={`text-sm text-white`} />
              </button>
              <span className="font-semibold text-brand-green">
                {item.quantity}
              </span>
              <button
                className="hover:bg-green-shadow1 transition-colors duration-200 bg-brand-green rounded-md px-1 py-1"
                onClick={() => handleQuantityIncrease(item)?.toFixed(2)}
              >
                <FaPlus className={`text-sm text-white`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="font-bold">
              {item?.product?.currency}
              {itemTotalCost(item)?.toFixed(2)}
            </p>
            <p className="text-sm">
              {item.quantity} x {item?.product?.currency}
              {itemUnitCost(item)?.toFixed(2)}
            </p>
            {productItemTax(item) > 0 && !taxfreeProduct(item) && (
              <p className="text-sm">
                product tax: {` `}
                {item.quantity} x {item?.product?.currency}
                {productItemTax(item)?.toFixed(2)}
              </p>
            )}

            {taxfreeProduct(item) && (
              <p className="text-sm text-brand-green font-semibold flex items-center gap-1">
                <FaMoneyCheckAlt className="text-brand-green" /> Tax Free
              </p>
            )}

            {/* Delete button */}
            <button className="hover:animate-pulse cursor-pointer p-1 hover:bg-gray-shadow7 rounded transition-colors duration-200">
              <FaTrashAlt
                title="remove from cart"
                className={` text-error transition-transform duration-100`}
                onClick={() => handleRemoveFromCart(item)}
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartProductList;
