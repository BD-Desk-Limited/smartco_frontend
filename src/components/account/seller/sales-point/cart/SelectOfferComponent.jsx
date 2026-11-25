import React from 'react';
import {
  FaTimes,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaGift,
  FaExclamationCircle,
} from 'react-icons/fa';
import Button from '@/components/account/Button';
import Image from 'next/image';
import {
  getOfferPick,
  getOfferProducts,
  resolveOfferProduct,
} from './offerHelpers';
import { commaNumberFormat } from '@/utilities/numbersUtils';

// Lets the cashier hand over a product reward that has one or more free products.
//   pick 'all'           -> every product in the reward is given
//   pick 'any' (N < all) -> the customer first chooses N products
// Then, for each product given, the cashier steps through the components the reward allows.
const SelectOfferComponent = ({
  products,
  selectedOffer,
  offerType,
  onClose,
  handleApplyOffer,
  mode,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  const pick = React.useMemo(
    () => getOfferPick(selectedOffer),
    [selectedOffer]
  );

  const resolved = React.useMemo(
    () =>
      getOfferProducts(selectedOffer).map((fp) =>
        resolveOfferProduct(products, fp)
      ),
    [products, selectedOffer]
  );

  const inStock = (r) =>
    r.product && r.product.availabilityStatus === 'in stock';

  // ids of the products being given. For 'all' this is everything; for 'any' the customer chooses.
  const [chosenIds, setChosenIds] = React.useState(() =>
    pick.mustChoose
      ? []
      : getOfferProducts(selectedOffer).map((fp) => String(fp._id))
  );
  const [stage, setStage] = React.useState(
    pick.mustChoose ? 'pick' : 'options'
  );
  const [stepIndex, setStepIndex] = React.useState(0);
  const [choices, setChoices] = React.useState({}); // { 'productId:componentIndex': choice | ' ' }

  const chosen = React.useMemo(
    () => resolved.filter((r) => chosenIds.includes(String(r.freeProduct._id))),
    [resolved, chosenIds]
  );

  // one step per component of each product being given
  const steps = React.useMemo(
    () =>
      chosen.flatMap((r) =>
        r.components.map((component, componentIndex) => ({
          key: `${r.freeProduct._id}:${componentIndex}`,
          resolved: r,
          component,
        }))
      ),
    [chosen]
  );
  const step = steps[stepIndex] || null;
  const allProductsFound = chosen.length > 0 && chosen.every((r) => r.product);
  const allInStock = chosen.every(inStock);
  const allStepsDone = steps.every((s) => choices[s.key]);

  const togglePick = (id) => {
    setChosenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return prev.length >= pick.count ? prev : [...prev, id];
    });
  };

  const goFromPick = () => {
    setStepIndex(0);
    setChoices({});
    setStage('options');
  };

  const onApply = () => {
    if (!allProductsFound || !allInStock || !allStepsDone) return;
    const picks = chosen.map((r) => {
      const selectedChoices = {};
      r.components.forEach((_, i) => {
        selectedChoices[i] = choices[`${r.freeProduct._id}:${i}`];
      });
      return {
        product: { ...r.product, components: r.components },
        selectedChoices,
        quantity: r.freeProduct.quantity || 1,
      };
    });
    handleApplyOffer(selectedOffer, offerType, { picks });
    onClose();
  };

  const shell = (children) => (
    <div
      className={`${mode === 'light' ? lightThemeStyle : darkThemeStyle} w-full h-full rounded-lg flex justify-center items-center opacity-95 p-5 relative`}
    >
      <span
        className="text-lg font-semibold absolute top-0 right-0 p-2 rounded-full cursor-pointer bg-error text-text-white hover:bg-error-hover"
        onClick={onClose}
      >
        <FaTimes />
      </span>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );

  const applyButton = (
    <Button
      onClick={onApply}
      buttonStyle={`bg-brand-green hover:bg-green-shadow1 p-3 rounded-r-lg w-fit font-semibold text-sm flex items-center justify-center h-fit absolute right-0 ${!allInStock ? 'cursor-not-allowed bg-gray-shadow7' : ''}`}
    >
      {!allInStock ? (
        <>
          <FaExclamationCircle className="text-error mr-1" />
          <span className="text-error font-semibold">Product not in stock</span>
        </>
      ) : (
        <>
          <FaGift
            className={`${mode !== 'light' ? 'text-text-white' : 'text-text-black'} mr-1`}
          />
          <span
            className={`${mode !== 'light' ? 'text-text-white' : 'text-text-black'} font-normal`}
          >
            Apply Offer
          </span>
        </>
      )}
    </Button>
  );

  if (!selectedOffer || resolved.length === 0) {
    return shell(
      <p className="text-lg font-semibold text-gray-shadow5">
        No promo offer selected.
      </p>
    );
  }

  /* ---------- stage 1: customer chooses which products (any N of M) ---------- */
  if (stage === 'pick') {
    return shell(
      <div className="w-full h-full p-2 flex flex-col">
        <span className="font-semibold">
          {`Choose ${pick.count} of ${pick.total} free products`}
          <span className="font-normal text-brand-green">{` (${chosenIds.length}/${pick.count} chosen)`}</span>
        </span>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 flex-1 overflow-y-auto scrollbar-thin content-start">
          {resolved.map((r) => {
            const id = String(r.freeProduct._id);
            const selected = chosenIds.includes(id);
            const available = inStock(r);
            return (
              <li
                key={id}
                onClick={available ? () => togglePick(id) : undefined}
                className={`rounded-md border flex flex-col text-center h-36 shadow-lg relative ${available ? 'cursor-pointer hover:border-brand-green' : 'opacity-50 cursor-not-allowed'}`}
              >
                {r.product?.imageURL ? (
                  <Image
                    src={r.product.imageURL}
                    alt={r.product.name}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover rounded-t-md mb-2"
                  />
                ) : (
                  <FaGift className="w-full h-20 p-4 text-gray-500" />
                )}
                <span className="text-sm font-semibold">
                  {r.product?.name || r.freeProduct.name || 'Unknown product'}
                </span>
                <span className="text-sm text-brand-green font-semibold">
                  {!r.product
                    ? 'Not on this till'
                    : !available
                      ? 'Out of stock'
                      : `qty: ${r.freeProduct.quantity || 1}`}
                </span>
                {selected && (
                  <div className="absolute inset-0 bg-green-shadow9 bg-opacity-50 flex items-center justify-center rounded-md border-2 border-brand-green">
                    <FaCheck className="p-3 h-[50%] w-[50%] text-black" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="w-full flex justify-end pt-3">
          <Button
            onClick={() => {
              if (chosenIds.length !== pick.count || !allInStock) {
                return;
              } else {
                steps.length === 0 ? onApply() : goFromPick();
              }
            }}
            buttonStyle={`bg-brand-green p-3 rounded-lg font-semibold text-sm ${chosenIds.length !== pick.count || !allInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={chosenIds.length !== pick.count || !allInStock}
          >
            {steps.length === 0 ? 'Apply Offer' : 'Next'}
          </Button>
        </div>
      </div>
    );
  }

  /* ---------- stage 2: component choices for every product given ---------- */
  if (!allProductsFound) {
    return shell(
      <p className="text-lg font-semibold text-gray-shadow5 text-center">
        A promo product could not be matched to the products on this till.
      </p>
    );
  }

  // products with no components to choose: nothing to step through
  if (steps.length === 0) {
    return shell(
      <div className="flex flex-col items-center gap-4">
        <p className="font-semibold">Free products in this offer</p>
        <ul className="text-center">
          {chosen.map((r) => (
            <li
              key={r.freeProduct._id}
            >{`${r.freeProduct.quantity || 1} × ${r.product.name}`}</li>
          ))}
        </ul>
        <div className="relative w-full h-12 flex justify-center">
          {applyButton}
        </div>
      </div>
    );
  }

  const product = step.resolved.product;
  const stepChoice = choices[step.key];
  const isLast = stepIndex === steps.length - 1;
  const setChoice = (value) =>
    setChoices((prev) => ({ ...prev, [step.key]: value }));

  return shell(
    <div className="w-full h-full p-2">
      <span className="text-base block font-semibold">
        {`${product.name} · item ${chosen.indexOf(step.resolved) + 1} of ${chosen.length} · step ${stepIndex + 1} of ${steps.length}`}
      </span>
      <span className="">
        {`Select your choice${step.component.categoryName ? ` of ${step.component.categoryName}` : ''}`}
        {step.component.isOptional && (
          <span className="text-sm font-normal text-gray-500">
            {' (optional)'}
          </span>
        )}
        {': '}
        <span className="font-normal text-brand-green">
          {stepChoice && stepChoice !== ' ' ? stepChoice.material?.name : ''}
        </span>
      </span>

      {step.component.materialChoices.length > 0 ? (
        <div className="mt-2 h-[78%] overflow-y-auto scrollbar-thin">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {step.component.isOptional && (
              <li
                onClick={() => setChoice(' ')}
                className="rounded-md border cursor-pointer flex flex-col text-center w-32 h-32 shadow-lg hover:border-brand-green relative"
              >
                <FaTimes className="w-full h-20 mb-2" />
                <span className="text-sm font-semibold">No, thank you</span>
                {stepChoice === ' ' && (
                  <div className="absolute inset-0 bg-green-shadow9 bg-opacity-50 flex items-center justify-center rounded-md border-2 border-brand-green">
                    <FaCheck className="p-3 h-[50%] w-[50%] text-black" />
                  </div>
                )}
              </li>
            )}
            {step.component.materialChoices.map((choice, index) => (
              <li
                key={index}
                onClick={() => setChoice(choice)}
                className="rounded-md border cursor-pointer flex flex-col text-center w-32 h-32 shadow-lg hover:border-brand-green relative"
              >
                <span className="absolute top-0 right-0 text-sm font-semibold p-1 bg-error text-text-white rounded-bl-md rounded-tr-sm">
                  {choice.additionalPrice > 0
                    ? ` +${product.currency}${commaNumberFormat(choice.additionalPrice, 2)}`
                    : ''}
                </span>
                {choice.material?.imageURL ? (
                  <Image
                    src={choice.material.imageURL}
                    alt={choice.material?.name || 'material'}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover rounded-t-md mb-2"
                  />
                ) : (
                  // no image uploaded for this material: keep the card layout with a placeholder
                  <div className="w-full h-20 rounded-t-md mb-2 bg-gray-100 flex items-center justify-center text-gray-400">
                    <FaGift className="w-6 h-6" />
                  </div>
                )}
                <span className="text-sm font-semibold">
                  {choice.material?.name}
                </span>
                <span className="text-sm">qty: {choice.quantity}</span>
                {stepChoice === choice && (
                  <div className="absolute inset-0 bg-green-shadow9 bg-opacity-50 flex items-center justify-center rounded-md border-2 border-brand-green">
                    <FaCheck className="p-3 h-[50%] w-[50%] text-black" />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-text-gray my-20">
          No material choices available for this component.
        </p>
      )}

      <div className="w-full flex flex-row justify-center items-center relative">
        {(stepIndex > 0 || pick.mustChoose) && (
          <button
            className="cursor-pointer text-brand-green hover:font-extrabold flex flex-row items-center absolute left-0"
            onClick={() =>
              stepIndex > 0 ? setStepIndex(stepIndex - 1) : setStage('pick')
            }
          >
            <FaChevronLeft />
            <FaChevronLeft />
            <span>Prev</span>
          </button>
        )}
        <p className="text-sm">
          <span className="font-semibold mr-5">Quantity</span>
          <span className="font-bold text-brand-green">
            {step.resolved.freeProduct.quantity || 1}
          </span>
        </p>
        {!isLast && stepChoice && (
          <button
            className="cursor-pointer text-brand-green hover:font-extrabold flex flex-row items-center absolute right-0"
            onClick={() => setStepIndex(stepIndex + 1)}
          >
            <span>Next</span>
            <FaChevronRight />
            <FaChevronRight />
          </button>
        )}
        {isLast && stepChoice && allStepsDone && applyButton}
      </div>
    </div>
  );
};

export default SelectOfferComponent;
