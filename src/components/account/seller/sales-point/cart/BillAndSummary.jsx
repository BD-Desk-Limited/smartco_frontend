import Button from '@/components/account/Button';
import Image from 'next/image';
import React from 'react';
import {
  FaCheckDouble,
  FaGift,
  FaMoneyBillWaveAlt,
  FaRegClock,
} from 'react-icons/fa';

const BillAndSummary = ({
  linkedCustomerData,
  productsTax,
  itemUnitCost,
  taxfreeProduct,
  workBranchVATRate,
  cartItems,
  handlePendOrder,
  subtotal,
  setTotal,
  showButtons,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  handleCheckout,
}) => {
  //helper function to get label for selected choices of an offer product
  const getSelectedChoicesLabel = (selectedChoices) => {
    const choicesArray = Array.isArray(selectedChoices)
      ? selectedChoices
      : selectedChoices && typeof selectedChoices === 'object'
        ? Object.values(selectedChoices)
        : [];

    return choicesArray
      .map((choiceItem) => choiceItem?.material?.name)
      .filter(Boolean)
      .join(', ')
      .slice(0, 50);
  };

  const freeProductsOffers =
    linkedCustomerData?.appliedOffers?.filter(
      (offer) => offer.type === 'product'
    ) || [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cashDiscounts =
    linkedCustomerData?.appliedOffers?.filter(
      (offer) => offer.type === 'cash'
    ) || [];

  const getTotalCashOfferDiscount = React.useCallback(() => {
    const totalCashDiscount = cashDiscounts.reduce((total, offer) => {
      const discountValue = offer?.amountDiscount || 0;
      const discountPercentage = offer?.percentageDiscount || 0;
      const totalCashDiscount =
        discountValue + (discountPercentage / 100) * subtotal(cartItems);
      return total + totalCashDiscount;
    }, 0);
    return totalCashDiscount;
  }, [cashDiscounts, subtotal, cartItems]);

  const getVATAmount = React.useCallback(() => {
    const taxableSubTotal = cartItems?.reduce((acc, item) => {
      if (taxfreeProduct(item)) return acc; // skip tax calculation for tax-free products
      const costPerItem = itemUnitCost(item) * item.quantity;
      return acc + costPerItem;
    }, 0);
    const totalTaxable = taxableSubTotal - getTotalCashOfferDiscount(); // apply cash discounts before calculating VAT
    const vatAmount = (totalTaxable * workBranchVATRate) / 100;
    return vatAmount || 0;
  }, [
    cartItems,
    getTotalCashOfferDiscount,
    itemUnitCost,
    taxfreeProduct,
    workBranchVATRate,
  ]);

  const getTotal = React.useCallback(() => {
    const vatAmount = getVATAmount();
    const total =
      subtotal(cartItems) -
      getTotalCashOfferDiscount() +
      productsTax(cartItems) +
      vatAmount;
    return total;
  }, [
    getVATAmount,
    subtotal,
    cartItems,
    getTotalCashOfferDiscount,
    productsTax,
  ]);

  React.useEffect(() => {
    const calculatedTotal = getTotal();
    setTotal(calculatedTotal);
  }, [getTotal, setTotal]);

  return (
    <div
      className={`shadow-md bg-opacity-5 h-full rounded-md p-0 flex flex-col gap-4 ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
    >
      {/* Applied offer products */}
      {freeProductsOffers?.length > 0 && (
        <div className="h-[60%] overflow-y-auto no-scrollbar">
          <h3 className="text-sm font-semibold mb-1 text-brand-green items-baseline flex flex-row">
            <FaGift className="inline-block mr-1" />
            Applied products Offers
          </h3>

          {/* free products from offers cards */}
          <ul className="flex flex-row overflow-x-auto scrollbar-thin list-none p-0 m-0 gap-2">
            {freeProductsOffers?.map((offer) => (
              <li
                key={offer?._id}
                className="mb-0 w-32 flex-shrink-0 border rounded-md p-1 flex flex-col items-start gap-1 text-small shadow-sm animate-pulse relative"
              >
                <p className="absolute top-0 right-0 px-2 rounded-full bg-error font-semibold text-white">
                  {offer?.freeProduct?.quantity}
                </p>
                {/* Image or icon for the free product */}
                {offer?.productDetails?.product?.imageURL ? (
                  <Image
                    src={offer?.productDetails?.product?.imageURL}
                    alt={offer?.productDetails?.product?.name}
                    width={20}
                    height={20}
                    className="w-fit h-20 rounded-md object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
                    <FaGift className="text-2xl text-gray-500" />
                  </div>
                )}
                <p className="text-xs">{offer?.description?.slice(0, 25)}...</p>
                <p className="text-sm">
                  {offer?.productDetails?.product?.name}
                </p>
                <p className="text-xs flex-wrap">
                  {getSelectedChoicesLabel(
                    offer?.productDetails?.selectedChoices
                  )}
                </p>
                <p className="text-sm font-semibold text-brand-green">Free</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bill summary + applied cash offers */}
      <div className="h-full overflow-y-auto scrollbar-thin relative ">
        {cashDiscounts.length > 0 && (
          <div className="overflow-y-auto scrollbar-thin gap-1 flex flex-col">
            <h3 className="text-sm font-semibold text-brand-green items-baseline flex flex-row">
              <FaMoneyBillWaveAlt className="inline-block mr-1" />
              Applied cash Offers:
              <span className="font-normal">
                {' -' + getTotalCashOfferDiscount()?.toFixed(2)}
              </span>
            </h3>

            <ul className="mx-5 flex flex-row overflow-x-auto scrollbar-thin gap-2">
              {cashDiscounts.map((offer) => (
                <li
                  key={offer._id}
                  className="list-none max-w-20 rounded-md p-2 border text-sm font-sans"
                >
                  {offer?.percentageDiscount > 0 && (
                    <span>
                      {offer?.percentageDiscount.toFixed(2) + '% off |'}
                    </span>
                  )}
                  {offer?.amountDiscount > 0 && (
                    <span>
                      {offer?.currency}
                      {` `}
                      {offer?.amountDiscount.toFixed(2) + ' off'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-2 border-t pt-2">
          <h3 className="font-semibold mb-2">Bill Summary</h3>
          <p className="text-sm border-b flex flex-row justify-between">
            <span>Sub-total:</span>{' '}
            <strong>{subtotal(cartItems)?.toFixed(2)}</strong>
          </p>
          {getTotalCashOfferDiscount() > 0 && (
            <p className="text-sm border-b flex flex-row justify-between">
              <span>Discount:</span>{' '}
              <strong>
                {'-'}
                {getTotalCashOfferDiscount()?.toFixed(2)}
              </strong>
            </p>
          )}

          {productsTax(cartItems) && productsTax(cartItems) > 0 && (
            <p className="text-sm border-b flex flex-row justify-between">
              <span>Products Tax:</span>{' '}
              <strong>{productsTax(cartItems)?.toFixed(2)}</strong>
            </p>
          )}
          {getVATAmount() && getVATAmount() > 0 && (
            <p className="text-sm border-b flex flex-row justify-between">
              <span>V.A.T ({workBranchVATRate}%):</span>{' '}
              <strong>{getVATAmount()?.toFixed(2)}</strong>
            </p>
          )}

          <p className="text flex flex-row justify-between">
            <span className="font-bold"> Total:</span>{' '}
            <strong>{getTotal()?.toFixed(2)}</strong>
          </p>
        </div>

        {/* Buttons */}
        {showButtons && (
          <div className="flex flex-row justify-between items-baseline bottom-0 absolute bg-opacity-95 backdrop-blur-lg w-full text-sm">
            <button
              className="px-1 py-2 bg-amber-500 hover:bg-amber-600 rounded-md text-white flex items-center gap-1 h-fit"
              onClick={handlePendOrder}
            >
              <FaRegClock className="inline-block mr-1" />
              Pend Order
            </button>

            <button
              className="p-4 bg-brand-green rounded-md hover:bg-green-shadow1 text-white flex items-center gap-1 text-base font-semibold"
              onClick={handleCheckout}
            >
              <FaCheckDouble className="inline-block mr-1" />
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillAndSummary;
