import Button from '@/components/account/Button';
import Image from 'next/image';
import React from 'react';
import {
  FaTimes,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaShoppingBag,
} from 'react-icons/fa';

const SelectedProductComponents = ({
  product,
  quantity,
  setQuantity,
  selectedChoices,
  setSelectedChoices,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  handleAddToCart,
}) => {
  const [currentComponentIndex, setCurrentComponentIndex] = React.useState(0);

  // Reset component index when product changes
  React.useEffect(() => {
    setCurrentComponentIndex(0);
  }, [product]);

  const currentComponent = product?.components
    ? product.components[currentComponentIndex]
    : null;

  const handleNext = () => {
    if (!selectedChoices[currentComponentIndex]) {
      return;
    }

    if (currentComponentIndex < product.components.length - 1) {
      setCurrentComponentIndex(currentComponentIndex + 1);
    } else {
      return;
    }
  };

  const handlePrevious = () => {
    if (currentComponentIndex > 0) {
      setCurrentComponentIndex(currentComponentIndex - 1);
    } else {
      return;
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${mode === 'light' ? lightThemeStyle : darkThemeStyle} rounded-lg p-5`}
    >
      {currentComponent && (
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
                    <span className="text-sm font-semibold">No, thank you</span>
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

                    {choice.material?.imageURL ? (
                      <Image
                        src={choice.material?.imageURL}
                        alt={choice.material?.name}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover rounded-t-md mb-2"
                      />
                    ) : (
                      <FaShoppingBag className="w-full h-20 object-cover rounded-t-md mb-2" />
                    )}
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
            <p className="text-sm text-text-gray mt-1">
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
            {/* Select quantity */}
            <p
              className={`w-fit flex flex-row justify-center items-center text-sm`}
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
            {/* Add to cart button */}
            {currentComponentIndex === product.components?.length - 1 &&
              selectedChoices[currentComponentIndex] && (
                <Button
                  onClick={() =>
                    handleAddToCart(product, selectedChoices, quantity)
                  }
                  buttonStyle={`bg-brand-green hover:bg-green-shadow1 p-3 rounded-r-lg w-fit font-semibold text-sm flex items-center justify-center h-fit absolute right-0
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
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedProductComponents;
