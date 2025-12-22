import ErrorInterface from '@/components/account/errorInterface';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SetPrices = ({
  products,
  setProducts,
  productIndex,
  bands,
  taxBands,
  bandsError,
  setBandsError,
  closePriceDropdown,
  companyDetails,
}) => {
  const [activeTab, setActiveTab] = useState('prices');

  const tabs = ['prices', 'tax'];

  // Initialize tax bands with 0 values by default
  React.useEffect(() => {
    if (taxBands && taxBands.length > 0) {
      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        const productToUpdate = updatedProducts[productIndex];

        if (!productToUpdate.productTax) {
          productToUpdate.productTax = [];
        }

        const validTaxBands = taxBands.filter((taxBand) => taxBand !== null);

        validTaxBands.forEach((taxBand) => {
          const existingTaxIndex = productToUpdate.productTax.findIndex(
            (taxObj) => taxObj.taxBand === taxBand._id
          );

          if (existingTaxIndex === -1) {
            productToUpdate.productTax.push({
              taxBand: taxBand._id,
              taxPercentage: 0,
              additionalTaxAmount: 0,
              isTaxExcluded: false,
            });
          }
        });

        return updatedProducts;
      });
    }
  }, [taxBands, productIndex, setProducts]);

  const handleNext = (e) => {
    e.preventDefault();

    setBandsError((prev) => ({ ...prev, [productIndex]: '' }));
    const currentTabIndex = tabs.findIndex((tab) => tab === activeTab);

    if (currentTabIndex !== -1 && currentTabIndex !== tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
    return;
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setBandsError((prev) => ({ ...prev, [productIndex]: '' }));

    const currentTabIndex = tabs.findIndex((tab) => tab === activeTab);

    if (currentTabIndex !== -1 && currentTabIndex !== 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
    return;
  };

  const handleTaxExclusionToggle = (taxBandId) => {
    setProducts((prevProducts) => {
      const updatedProducts = JSON.parse(JSON.stringify(prevProducts)); // Deep clone
      const productToUpdate = updatedProducts[productIndex];

      if (!productToUpdate.productTax) {
        productToUpdate.productTax = [];
      }

      const taxBandIndex = productToUpdate.productTax.findIndex(
        (taxObj) => taxObj.taxBand === taxBandId
      );

      if (taxBandIndex !== -1) {
        const currentExcludedState =
          productToUpdate.productTax[taxBandIndex].isTaxExcluded;
        productToUpdate.productTax[taxBandIndex].isTaxExcluded =
          !currentExcludedState;

        // If now excluded, reset tax values to 0
        if (!currentExcludedState) {
          productToUpdate.productTax[taxBandIndex].taxPercentage = 0;
          productToUpdate.productTax[taxBandIndex].additionalTaxAmount = 0;
        }
      } else {
        productToUpdate.productTax.push({
          taxBand: taxBandId,
          taxPercentage: 0,
          additionalTaxAmount: 0,
          isTaxExcluded: true,
        });
      }

      return updatedProducts;
    });
  };

  const handleToggleAllTaxExclusion = () => {
    setProducts((prevProducts) => {
      const updatedProducts = JSON.parse(JSON.stringify(prevProducts));
      const productToUpdate = updatedProducts[productIndex];

      if (!productToUpdate.productTax) {
        productToUpdate.productTax = [];
      }

      // Check if all tax bands are currently excluded
      const validTaxBands = taxBands.filter((taxBand) => taxBand !== null);
      const allExcluded = validTaxBands.every((taxBand) => {
        const taxObj = productToUpdate.productTax.find(
          (tax) => tax.taxBand === taxBand._id
        );
        return taxObj?.isTaxExcluded === true;
      });

      // Toggle all to opposite state
      const newExcludedState = !allExcluded;

      validTaxBands.forEach((taxBand) => {
        const taxBandIndex = productToUpdate.productTax.findIndex(
          (taxObj) => taxObj.taxBand === taxBand._id
        );

        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].isTaxExcluded =
            newExcludedState;

          // If now excluded, reset tax values to 0
          if (newExcludedState) {
            productToUpdate.productTax[taxBandIndex].taxPercentage = 0;
            productToUpdate.productTax[taxBandIndex].additionalTaxAmount = 0;
          }
        } else {
          productToUpdate.productTax.push({
            taxBand: taxBand._id,
            taxPercentage: 0,
            additionalTaxAmount: 0,
            isTaxExcluded: newExcludedState,
          });
        }
      });

      return updatedProducts;
    });
  };

  const handleOnEnterPriceOrTax = (e, band, type) => {
    const inputValue = e.target.value;
    const value = inputValue === '' ? 0 : parseFloat(inputValue);

    // Check for NaN and default to 0
    const safeValue = isNaN(value) ? 0 : value;

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const productToUpdate = updatedProducts[productIndex];

      if (type === 'price') {
        if (!productToUpdate.pricing) {
          productToUpdate.pricing = [];
        }
        const bandIndex = productToUpdate.pricing.findIndex(
          (priceObj) => priceObj.band === band
        );
        if (bandIndex !== -1) {
          productToUpdate.pricing[bandIndex].price = safeValue;
        } else {
          productToUpdate.pricing.push({ band: band, price: safeValue });
        }
      } else if (type === 'tax') {
        if (!productToUpdate.productTax) {
          productToUpdate.productTax = [];
        }
        const taxBandIndex = productToUpdate.productTax.findIndex(
          (taxObj) => taxObj.taxBand === band._id
        );
        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].taxPercentage = safeValue;
        } else {
          productToUpdate.productTax.push({
            taxBand: band._id,
            taxPercentage: safeValue,
            additionalTaxAmount: 0,
            isTaxExcluded: false,
          });
        }
      } else if (type === 'additional') {
        if (!productToUpdate.productTax) {
          productToUpdate.productTax = [];
        }
        const taxBandIndex = productToUpdate.productTax.findIndex(
          (taxObj) => taxObj.taxBand === band._id
        );
        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].additionalTaxAmount =
            safeValue;
        } else {
          productToUpdate.productTax.push({
            taxBand: band._id,
            additionalTaxAmount: safeValue,
            taxPercentage: 0,
            isTaxExcluded: false,
          });
        }
      }

      return updatedProducts;
    });
  };

  const handleDone = (e) => {
    e.preventDefault();
    setBandsError((prev) => ({ ...prev, [productIndex]: '' }));

    //check if all bands have prices
    const productToCheck = products[productIndex];

    //filter out null bands
    const validBands = bands.filter((band) => band !== null);

    //check if all bands have prices set
    const allBandsHavePrices = validBands.every((band) => {
      const priceObj = productToCheck.pricing?.find(
        (price) => price.band === band
      );
      return priceObj && priceObj.price > 0;
    });

    if (!allBandsHavePrices) {
      setBandsError((prev) => ({
        ...prev,
        [productIndex]: 'Please set a price for all price-bands.',
      }));
      setActiveTab('prices');
      return;
    }
    //filter out null tax bands
    const validTaxBands = taxBands.filter((taxBand) => taxBand !== null);

    //check if all tax bands have required fields set (or are excluded)
    const allTaxBandsSet = validTaxBands.every((taxBand) => {
      const taxObj = productToCheck.productTax?.find(
        (tax) => tax.taxBand === taxBand._id
      );

      // If tax is excluded for this band, it's valid
      if (taxObj?.isTaxExcluded) {
        return true;
      }

      // If not excluded, check that percentage and amount are set
      return (
        taxObj &&
        taxObj.taxPercentage !== undefined &&
        taxObj.taxPercentage !== null &&
        taxObj.additionalTaxAmount !== undefined &&
        taxObj.additionalTaxAmount !== null &&
        taxObj.isTaxExcluded !== undefined
      );
    });

    if (!allTaxBandsSet) {
      setBandsError((prev) => ({
        ...prev,
        [productIndex]:
          'Please configure all tax bands. For non-excluded bands, set tax percentage and additional amount. If no tax, set to 0 or check &quot;Tax Excluded&quot;.',
      }));
      setActiveTab('tax');
      return;
    }

    //if all validations pass, close the overlay
    closePriceDropdown();
    setBandsError('');
  };

  console.log('Set Taxes:', products[productIndex]);

  return (
    <>
      {/* set Prices */}
      {activeTab === 'prices' && (
        <div className="min-h-[30vh] flex flex-col py-3 px-1 w-full items-center gap-1">
          <div className="flex flex-col text-center gap-1">
            <span className="text-sm w-full">
              set price for this product in all your store price bands
            </span>
          </div>

          {bandsError[productIndex] && (
            <span className="bg-white p-1 w-full font-semibold">
              <ErrorInterface error={bandsError[productIndex]} />
            </span>
          )}

          {/* price inputs for each band */}
          <div className="flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto scrollbar-thin w-full">
            {bands.length > 0 &&
              bands.map(
                (band, index) =>
                  band !== null && (
                    <li
                      key={index}
                      className="list-none w-full flex flex-row gap-1"
                    >
                      <span className="bg-blue-shadow4 p-2 rounded-md w-1/2">
                        {band}
                      </span>
                      <span className="flex font-serif font-semibold items-center">
                        {companyDetails?.currency?.symbol || '$'}
                      </span>
                      <input
                        type="number"
                        min={0}
                        placeholder={`${companyDetails?.currency?.symbol || '$'}0.00`}
                        value={
                          products[productIndex].pricing?.find(
                            (priceObj) => priceObj.band === band
                          )?.price || ''
                        }
                        onChange={(e) =>
                          handleOnEnterPriceOrTax(e, band, 'price')
                        }
                        className="w-1/2 rounded-md px-1 text-text-black"
                      />
                    </li>
                  )
              )}
          </div>
        </div>
      )}

      {/* set tax rates */}
      {activeTab === 'tax' && (
        <div className="min-h-[30vh] flex flex-col py-3 px-1 w-full items-center gap-1">
          <div className="flex flex-col text-center gap-1">
            <span className="font-semibold text-base">
              {`Product Tax Configuration`}
            </span>
            <span className="text-sm w-full">
              Configure tax settings for each tax band. Check &quot;Tax Excluded&quot; to
              exempt this product from that specific tax band.
            </span>
          </div>

          {/* Master toggle for all tax bands */}
          <div className="w-full bg-blue-shadow8 border-2 border-brand-blue rounded-lg p-3 mb-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-semibold text-white">
                Product excluded from tax in all tax bands?
              </span>
              <input
                type="checkbox"
                checked={
                  taxBands.filter((tb) => tb !== null).length > 0 &&
                  taxBands
                    .filter((tb) => tb !== null)
                    .every((taxBand) => {
                      const taxObj = products[productIndex].productTax?.find(
                        (tax) => tax.taxBand === taxBand._id
                      );
                      return taxObj?.isTaxExcluded === true;
                    })
                }
                onChange={handleToggleAllTaxExclusion}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>

          {bandsError[productIndex] && (
            <span className="bg-white p-1 w-full font-semibold">
              <ErrorInterface error={bandsError[productIndex]} />
            </span>
          )}
          <div className="flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto scrollbar-thin w-full">
            {taxBands.length > 0 &&
              taxBands.map(
                (taxBand, index) =>
                  taxBand !== null && (
                    <div
                      key={taxBand._id}
                      className="flex flex-col border border-gray-border rounded-lg p-2 bg-blue-shadow4"
                    >
                      <div className="flex flex-row items-center justify-between mb-2">
                        <span className="font-semibold text-base text-white">
                          {taxBand.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">
                            Tax Excluded?
                          </span>
                          <input
                            type="checkbox"
                            checked={
                              products[productIndex].productTax?.find(
                                (taxObj) => taxObj.taxBand === taxBand._id
                              )?.isTaxExcluded || false
                            }
                            onChange={() =>
                              handleTaxExclusionToggle(taxBand._id)
                            }
                            className="w-5 h-5 cursor-pointer rounded-md"
                          />
                        </div>
                      </div>

                      {!products[productIndex].productTax?.find(
                        (taxObj) => taxObj.taxBand === taxBand._id
                      )?.isTaxExcluded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <span className="text-white text-sm w-32">
                              Tax Percentage:
                            </span>
                            <span className="flex font-bold items-center text-white">
                              %
                            </span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={
                                products[productIndex].productTax?.find(
                                  (taxObj) => taxObj.taxBand === taxBand._id
                                )?.taxPercentage || ''
                              }
                              onChange={(e) =>
                                handleOnEnterPriceOrTax(e, taxBand, 'tax')
                              }
                              placeholder={'0.00'}
                              className="flex-1 rounded-md p-1 text-text-black"
                            />
                          </div>
                          <div className="flex flex-row gap-2 items-center">
                            <span className="text-white text-sm w-32">
                              Additional Amount:
                            </span>
                            <span className="flex font-bold items-center text-white">
                              {companyDetails?.currency?.symbol || '$'}
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={
                                products[productIndex].productTax?.find(
                                  (taxObj) => taxObj.taxBand === taxBand._id
                                )?.additionalTaxAmount || ''
                              }
                              onChange={(e) =>
                                handleOnEnterPriceOrTax(
                                  e,
                                  taxBand,
                                  'additional'
                                )
                              }
                              placeholder={`0.00`}
                              className="flex-1 rounded-md p-1 text-text-black"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
              )}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="w-full my-2 flex flex-col gap-1 px-2">
        <hr className="border border-blue-shadow4 w-full" />

        <div className="w-full flex flex-row justify-between">
          <button
            onClick={handlePrev}
            disabled={activeTab === tabs[0]}
            className={`
            ${activeTab === tabs[0] && 'opacity-50 cursor-not-allowed'} 
            p-2 text-brand-blue bg-text-white w-fit rounded-l-md hover:bg-blue-shadow9`}
          >
            {`< Prev`}
          </button>

          {activeTab === tabs[tabs.length - 1] ? (
            <button
              onClick={handleDone}
              className={`py-2 px-4 text-brand-blue bg-text-white w-fit rounded-md hover:bg-blue-shadow9`}
            >
              Done
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={activeTab === tabs[tabs.length - 1]}
              className={`
              ${activeTab === tabs[tabs.length - 1] && 'opacity-50 cursor-not-allowed'} 
              p-2 text-brand-blue bg-text-white w-fit rounded-r-md hover:bg-blue-shadow9`}
            >
              {`Next >`}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SetPrices;
