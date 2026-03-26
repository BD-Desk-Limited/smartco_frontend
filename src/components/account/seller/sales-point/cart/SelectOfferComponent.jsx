import React from 'react';
import {
  FaTimes,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaGift,
  FaExclamationCircle,
} from 'react-icons/fa';
import Button from '@/components/account/Button';
import Image from 'next/image';

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
  const [selectedChoices, setSelectedChoices] = React.useState({});
  const [currentComponentIndex, setCurrentComponentIndex] = React.useState(0);
  const isPromoOffer = true; // flag to indicate this is an offer product being added to cart
  const quantity = selectedOffer?.freeProduct?.quantity || 1;

  // helper function to normalize id values for comparison
  const normalizeId = React.useCallback((value) => String(value ?? ''), []);

  const fetchProductDetails = React.useCallback(() => {
    if (!Array.isArray(products) || !selectedOffer?.freeProduct?._id) {
      return null;
    }

    //get the allowed components for the free product in the offer
    const offerProductComponents =
      selectedOffer?.freeProduct?.allowedComponents || [];

    //helper function to check if a component is allowed based on the offer's allowed components
    const isComponentAllowed = (componentId) => {
      return offerProductComponents.some(
        (allowedComponent) =>
          normalizeId(allowedComponent._id) === normalizeId(componentId)
      );
    };

    //find the product in the products array using the productId
    const product = products.find(
      (p) => normalizeId(p._id) === normalizeId(selectedOffer?.freeProduct?._id)
    );

    if (product) {
      //filter the product's components to get only allowed components based on the offer's allowed components
      const allowedComponents =
        product.components?.filter((component) =>
          isComponentAllowed(component._id)
        ) || [];

      // filter the allowed components to include only the allowed material choices based on the offer's allowed components
      const componentsWithAllowedMaterials = allowedComponents.map(
        (component) => {
          const matchAllowedOfferComponent = offerProductComponents.find(
            (allowedComponent) =>
              normalizeId(allowedComponent._id) === normalizeId(component._id)
          );

          if (matchAllowedOfferComponent) {
            const allowedChoiceIds = (
              matchAllowedOfferComponent.allowedMaterialChoices || []
            ).map(normalizeId);

            const allowedMaterialChoices =
              component.materialChoices?.filter((materialChoice) =>
                allowedChoiceIds.includes(
                  normalizeId(materialChoice?.material?._id)
                )
              ) || [];

            return {
              ...component,
              materialChoices: allowedMaterialChoices || [],
            };
          }

          return null;
        }
      );
      //return the product with the filtered allowed components and their allowed material choices
      return {
        ...product,
        components: componentsWithAllowedMaterials.filter(Boolean) || [],
      };
    }

    return null;
  }, [normalizeId, products, selectedOffer]);

  const product = React.useMemo(
    () => fetchProductDetails(),
    [fetchProductDetails]
  );

  const currentComponent = React.useMemo(() => {
    if (!product?.components?.length) return null;
    return product.components[currentComponentIndex] || null;
  }, [product, currentComponentIndex]);

  const handleNext = React.useCallback(() => {
    if (!product?.components?.length) return;

    setCurrentComponentIndex((prev) =>
      Math.min(prev + 1, product.components.length - 1)
    );
  }, [product]);

  const handlePrevious = React.useCallback(() => {
    if (!product?.components?.length) return;

    setCurrentComponentIndex((prev) => Math.max(prev - 1, 0));
  }, [product]);

  React.useEffect(() => {
    setCurrentComponentIndex(0);
  }, [product]);

  const onApplyOffer = () => {
    if (product.availabilityStatus !== 'in Stock') return;
    handleApplyOffer(selectedOffer, offerType, {
      product,
      selectedChoices,
      quantity,
    });
    onClose();
  };

  return (
    <div
      className={`${mode === 'light' ? lightThemeStyle : darkThemeStyle} w-full h-full rounded-lg flex justify-center items-center opacity-95 p-5 relative`}
    >
      <span
        className="text-lg font-semibold absolute top-0 right-0 p-2 rounded-full cursor-pointer bg-error text-text-white hover:bg-error-hover"
        onClick={onClose}
      >
        <FaTimes />
      </span>

      <div
        className={`w-full h-full flex flex-col justify-center items-center`}
      >
        {!selectedOffer ? (
          <p className="text-lg font-semibold text-gray-shadow5">
            No promo offer selected.
          </p>
        ) : !product ? (
          <p className="text-lg font-semibold text-gray-shadow5 text-center">
            Promo product could not be matched to the available product list.
          </p>
        ) : product?.components?.length > 0 ? (
          <div className="w-full h-full p-2">
            <span className="font-semibold">
              {`Select your choice ${
                currentComponent?.categoryName &&
                `of ${currentComponent.categoryName}`
              }`}
              {currentComponent?.isOptional && (
                <span className="text-sm font-normal text-gray-500">
                  {` (optional)`}
                </span>
              )}
              {': '}
              <span className="font-normal text-brand-green">
                {selectedChoices[currentComponentIndex] &&
                  selectedChoices[currentComponentIndex].material?.name}
              </span>
            </span>
            {currentComponent?.materialChoices &&
            currentComponent.materialChoices.length > 0 ? (
              <ul className="w-full flex flex-col mt-2 h-[92%] overflow-y-auto no-scrollbar">
                {currentComponent?.isOptional && (
                  <li
                    onClick={() =>
                      setSelectedChoices((prev) => ({
                        ...prev,
                        [currentComponentIndex]: ' ',
                      }))
                    }
                    className="rounded-md border cursor-pointer flex flex-col text-center w-32 h-32 shadow-lg hover:border-brand-green transition-colors duration-200  relative"
                  >
                    <FaTimes
                      width={100}
                      height={100}
                      className="w-full h-20 object-cover rounded-t-md mb-2"
                    />
                    <p className="flex flex-col">
                      <span className="text-sm font-semibold">
                        No, thank you
                      </span>
                    </p>
                    {selectedChoices[currentComponentIndex] === ' ' && (
                      <div className="absolute top-0 left-0 w-full h-full bg-green-shadow9 bg-opacity-50 flex items-center justify-center rounded-md border-2 border-brand-green">
                        <FaCheck className="p-3 h-[50%] w-[50%] font-thin text-black" />
                      </div>
                    )}
                  </li>
                )}
                {/* Material choices */}
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 h-[80%] overflow-y-auto scrollbar-thin">
                  {currentComponent.materialChoices.map((choice, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedChoices((prev) => ({
                          ...prev,
                          [currentComponentIndex]: choice,
                        }));
                      }}
                      className="rounded-md border cursor-pointer flex flex-col text-center w-32 h-32 shadow-lg hover:border-brand-green transition-colors duration-200  relative"
                    >
                      {/* If additional price applies to choice, show additional price */}
                      <span className="absolute top-0 right-0 text-sm font-semibold p-1 bg-error text-text-white rounded-bl-md rounded-tr-sm">
                        {choice.additionalPrice > 0
                          ? ` +${product.currency}${choice.additionalPrice.toFixed(2)}`
                          : ''}
                      </span>
                      <Image
                        src={choice.material?.imageURL}
                        alt={choice.material?.name}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover rounded-t-md mb-2"
                      />
                      <p className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {choice.material?.name}
                        </span>
                        <span className="text-sm">qty: {choice.quantity}</span>
                      </p>
                      {/* If this choice is selected, show checkmark on semi-transparent background, covering the entire card */}
                      {selectedChoices[currentComponentIndex] === choice && (
                        <div className="absolute top-0 left-0 w-full h-full bg-green-shadow9 bg-opacity-50 flex items-center justify-center rounded-md border-2 border-brand-green">
                          <FaCheck className="p-3 h-[50%] w-[50%] font-thin text-black" />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </ul>
            ) : (
              <p className="text-sm text-text-gray my-20">
                No material choices available for this component.
              </p>
            )}
            {/* Navigation buttons */}
            <div className="w-full flex flex-row justify-center items-center relative">
              {currentComponentIndex > 0 && (
                <button
                  className={
                    'cursor-pointer text-brand-green hover:font-extrabold flex flex-row items-center transition-colors duration-200 absolute left-0'
                  }
                  onClick={handlePrevious}
                  disabled={currentComponentIndex === 0}
                >
                  <FaChevronLeft className="" />
                  <FaChevronLeft className="" />
                  <span>Prev</span>
                </button>
              )}
              {/* Show quantity */}
              <p
                className={`w-fit flex flex-row justify-center items-center text-sm`}
              >
                <span className={`font-semibold mr-5`}>Quantity</span>
                <span className={`flex flex-row items-center space-x-0`}>
                  {selectedOffer?.freeProduct?.quantity || 1}
                  <span
                    className={`w-16 text-center text-base font-bold text-brand-green bg-transparent rounded-md outline-none [&::-webkit-outer-spin-button]:hidden [&::-webkit-inner-spin-button]:hidden`}
                  />
                </span>
              </p>
              {currentComponentIndex < product.components.length - 1 &&
                selectedChoices[currentComponentIndex] && (
                  <button
                    className={
                      'cursor-pointer text-brand-green hover:font-extrabold flex flex-row items-center transition-colors duration-200 absolute right-0'
                    }
                    onClick={handleNext}
                    disabled={
                      currentComponentIndex === product.components.length - 1
                    }
                  >
                    <span>Next</span>
                    <FaChevronRight className="" />
                    <FaChevronRight className="" />
                  </button>
                )}
              {/* Add offer button */}
              {currentComponentIndex === product.components?.length - 1 &&
                selectedChoices[currentComponentIndex] && (
                  <Button
                    onClick={onApplyOffer}
                    buttonStyle={`bg-brand-green hover:bg-green-shadow1 p-3 rounded-r-lg w-fit font-semibold text-sm flex items-center justify-center h-fit absolute right-0
                    ${product.availabilityStatus !== 'in Stock' ? 'cursor-not-allowed bg-gray-shadow7 hover:bg-text-white' : ''}
                  `}
                  >
                    {product.availabilityStatus !== 'in Stock' ? (
                      <>
                        <FaExclamationCircle className={`text-error mr-1`} />
                        <span className={`text-error font-semibold`}>
                          Product not in stock
                        </span>
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
                )}
            </div>
          </div>
        ) : (
          <p className="text-lg font-semibold text-gray-shadow5">
            No components to select for this offer product.
          </p>
        )}
      </div>
    </div>
  );
};

export default SelectOfferComponent;
