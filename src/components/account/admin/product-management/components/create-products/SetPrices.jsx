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
  const today = new Date().toISOString().split('T')[0];

  React.useEffect(() => {
    if (!taxBands || taxBands.length === 0) return;

    const validTaxBands = taxBands.filter((tb) => tb !== null);

    setProducts((prevProducts) => {
      const productToCheck = prevProducts[productIndex];
      if (!productToCheck) return prevProducts;

      const missingTaxBands = validTaxBands.filter(
        (taxBand) =>
          !productToCheck.productTax?.some(
            (taxObj) => taxObj.taxBand === taxBand._id
          )
      );

      if (missingTaxBands.length === 0) return prevProducts;

      const updatedProducts = JSON.parse(JSON.stringify(prevProducts));
      const productToUpdate = updatedProducts[productIndex];

      if (!productToUpdate.productTax) {
        productToUpdate.productTax = [];
      }

      missingTaxBands.forEach((taxBand) => {
        productToUpdate.productTax.push({
          taxBand: taxBand._id,
          taxPercentage: 0,
          additionalTaxAmount: 0,
          isTaxExcluded: false,
          effectiveDate: today,
        });
      });

      return updatedProducts;
    });
  }, [taxBands, productIndex, setProducts, today]);

  const handleNext = (e) => {
    e.preventDefault();
    setBandsError((prev) => ({ ...prev, [productIndex]: '' }));
    const currentTabIndex = tabs.findIndex((tab) => tab === activeTab);
    if (currentTabIndex !== -1 && currentTabIndex !== tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1]);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setBandsError((prev) => ({ ...prev, [productIndex]: '' }));
    const currentTabIndex = tabs.findIndex((tab) => tab === activeTab);
    if (currentTabIndex !== -1 && currentTabIndex !== 0) {
      setActiveTab(tabs[currentTabIndex - 1]);
    }
  };

  const handleTaxExclusionToggle = (taxBandId) => {
    setProducts((prevProducts) => {
      const updatedProducts = JSON.parse(JSON.stringify(prevProducts));
      const productToUpdate = updatedProducts[productIndex];

      if (!productToUpdate.productTax) productToUpdate.productTax = [];

      const taxBandIndex = productToUpdate.productTax.findIndex(
        (taxObj) => taxObj.taxBand === taxBandId
      );

      if (taxBandIndex !== -1) {
        const currentExcludedState =
          productToUpdate.productTax[taxBandIndex].isTaxExcluded;
        productToUpdate.productTax[taxBandIndex].isTaxExcluded =
          !currentExcludedState;
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
          effectiveDate: today,
        });
      }

      return updatedProducts;
    });
  };

  const handleToggleAllTaxExclusion = () => {
    setProducts((prevProducts) => {
      const updatedProducts = JSON.parse(JSON.stringify(prevProducts));
      const productToUpdate = updatedProducts[productIndex];

      if (!productToUpdate.productTax) productToUpdate.productTax = [];

      const validTaxBands = taxBands.filter((taxBand) => taxBand !== null);
      const allExcluded = validTaxBands.every((taxBand) => {
        const taxObj = productToUpdate.productTax.find(
          (tax) => tax.taxBand === taxBand._id
        );
        return taxObj?.isTaxExcluded === true;
      });

      const newExcludedState = !allExcluded;

      validTaxBands.forEach((taxBand) => {
        const taxBandIndex = productToUpdate.productTax.findIndex(
          (taxObj) => taxObj.taxBand === taxBand._id
        );

        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].isTaxExcluded =
            newExcludedState;
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
            effectiveDate: today,
          });
        }
      });

      return updatedProducts;
    });
  };

  const handleOnEnterPriceOrTax = (e, band, type) => {
    const inputValue = e.target.value;
    const safeValue =
      inputValue === ''
        ? ''
        : isNaN(parseFloat(inputValue))
          ? 0
          : parseFloat(inputValue);

    setProducts((prevProducts) => {
      const updatedProducts = JSON.parse(JSON.stringify(prevProducts));
      const productToUpdate = updatedProducts[productIndex];

      if (type === 'price') {
        if (!productToUpdate.pricing) productToUpdate.pricing = [];
        const bandIndex = productToUpdate.pricing.findIndex(
          (p) => p.band === band
        );
        if (bandIndex !== -1) {
          productToUpdate.pricing[bandIndex].price = safeValue;
        } else {
          productToUpdate.pricing.push({
            band,
            price: safeValue,
            effectiveDate: today,
          });
        }
      } else if (type === 'priceEffectiveDate') {
        if (!productToUpdate.pricing) productToUpdate.pricing = [];
        const selectedDate = inputValue < today ? today : inputValue;
        const bandIndex = productToUpdate.pricing.findIndex(
          (p) => p.band === band
        );
        if (bandIndex !== -1) {
          productToUpdate.pricing[bandIndex].effectiveDate = selectedDate;
        } else {
          productToUpdate.pricing.push({
            band,
            price: 0,
            effectiveDate: selectedDate,
          });
        }
      } else if (type === 'tax') {
        if (!productToUpdate.productTax) productToUpdate.productTax = [];
        const idx = productToUpdate.productTax.findIndex(
          (t) => t.taxBand === band._id
        );
        if (idx !== -1) {
          productToUpdate.productTax[idx].taxPercentage = safeValue;
          // ✅ ensure isTaxExcluded is always set
          if (productToUpdate.productTax[idx].isTaxExcluded === undefined) {
            productToUpdate.productTax[idx].isTaxExcluded = false;
          }
        } else {
          productToUpdate.productTax.push({
            taxBand: band._id,
            taxPercentage: safeValue,
            additionalTaxAmount: 0,
            isTaxExcluded: false,
            effectiveDate: today,
          });
        }
      } else if (type === 'additional') {
        if (!productToUpdate.productTax) productToUpdate.productTax = [];
        const idx = productToUpdate.productTax.findIndex(
          (t) => t.taxBand === band._id
        );
        if (idx !== -1) {
          productToUpdate.productTax[idx].additionalTaxAmount = safeValue;
          // ✅ ensure isTaxExcluded is always set
          if (productToUpdate.productTax[idx].isTaxExcluded === undefined) {
            productToUpdate.productTax[idx].isTaxExcluded = false;
          }
        } else {
          productToUpdate.productTax.push({
            taxBand: band._id,
            additionalTaxAmount: safeValue,
            taxPercentage: 0,
            isTaxExcluded: false,
            effectiveDate: today,
          });
        }
      } else if (type === 'taxEffectiveDate') {
        if (!productToUpdate.productTax) productToUpdate.productTax = [];
        const selectedDate = inputValue < today ? today : inputValue;
        const taxBandIndex = productToUpdate.productTax.findIndex(
          (t) => t.taxBand === band._id
        );
        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].effectiveDate = selectedDate;
          // ✅ ensure isTaxExcluded is always set
          if (
            productToUpdate.productTax[taxBandIndex].isTaxExcluded === undefined
          ) {
            productToUpdate.productTax[taxBandIndex].isTaxExcluded = false;
          }
        } else {
          productToUpdate.productTax.push({
            taxBand: band._id,
            taxPercentage: 0,
            additionalTaxAmount: 0,
            isTaxExcluded: false,
            effectiveDate: selectedDate,
          });
        }
      }

      return updatedProducts;
    });
  };

  const handleDone = (e) => {
    e.preventDefault();
    setBandsError((prev) => ({ ...prev, [productIndex]: '' }));

    const productToCheck = products[productIndex];

    //normalize missing isTaxExcluded before validating
    const normalizedTax = (productToCheck.productTax || []).map((t) => ({
      ...t,
      isTaxExcluded: t.isTaxExcluded ?? false,
    }));
    const normalizedProduct = { ...productToCheck, productTax: normalizedTax };

    const validBands = bands.filter((band) => band !== null);
    const allBandsHavePrices = validBands.every((band) => {
      const priceObj = normalizedProduct.pricing?.find(
        (price) => price.band === band
      );
      return priceObj && Number(priceObj.price) > 0;
    });

    if (!allBandsHavePrices) {
      setBandsError((prev) => ({
        ...prev,
        [productIndex]: 'Please set a price for all price-bands.',
      }));
      setActiveTab('prices');
      return;
    }

    const validTaxBands = taxBands.filter((taxBand) => taxBand !== null);
    const allTaxBandsSet = validTaxBands.every((taxBand) => {
      const taxObj = normalizedProduct.productTax?.find(
        (tax) => tax.taxBand === taxBand._id
      );

      if (!taxObj) return false;
      if (taxObj.isTaxExcluded) return true;

      //allow 0 as valid, just reject undefined/null/empty string
      return (
        taxObj.taxPercentage !== undefined &&
        taxObj.taxPercentage !== null &&
        taxObj.taxPercentage !== '' &&
        taxObj.additionalTaxAmount !== undefined &&
        taxObj.additionalTaxAmount !== null &&
        taxObj.additionalTaxAmount !== ''
      );
    });

    if (!allTaxBandsSet) {
      setBandsError((prev) => ({
        ...prev,
        [productIndex]:
          'Please configure all tax bands. For non-excluded bands, set tax percentage and additional amount. If no tax, set to 0 or check the tax excluded box.',
      }));
      setActiveTab('tax');
      return;
    }

    closePriceDropdown();
    setBandsError('');
  };

  return (
    <>
      {/* set Prices */}
      {activeTab === 'prices' && (
        <div className="min-h-[30vh] flex flex-col py-3 px-1 w-full items-center gap-1">
          <div className="flex flex-col text-center gap-1">
            <span className="text-sm w-full text-white">
              Set price for this product in all your store price bands
            </span>
          </div>

          {bandsError[productIndex] && (
            <span className="bg-white p-1 w-full font-semibold">
              <ErrorInterface error={bandsError[productIndex]} />
            </span>
          )}

          <div className="flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto scrollbar-thin w-full">
            <li className="list-none w-full flex flex-row gap-1">
              <span className="w-1/3 text-white">Band</span>
              <span className="w-1/3 font-serif font-semibold text-white">
                Price
              </span>
              <span className="w-1/3 text-white">Effective Date</span>
            </li>
            {bands.length > 0 &&
              bands.map(
                (band, index) =>
                  band !== null && (
                    <li
                      key={index}
                      className="list-none w-full flex flex-row gap-1"
                    >
                      <span className="bg-blue-shadow4 p-2 rounded-md w-1/3 text-white">
                        {band}
                      </span>
                      <span className="flex font-serif font-semibold items-center text-white">
                        {companyDetails?.currency?.symbol || ' '}
                      </span>
                      <input
                        type="number"
                        min={0}
                        placeholder={`${companyDetails?.currency?.symbol || ' '}0.00`}
                        value={
                          products[productIndex].pricing?.find(
                            (priceObj) => priceObj.band === band
                          )?.price ?? ''
                        }
                        onChange={(e) =>
                          handleOnEnterPriceOrTax(e, band, 'price')
                        }
                        className="w-1/3 rounded-md px-1 text-text-black"
                      />
                      <input
                        type="date"
                        min={today}
                        value={(() => {
                          const dateVal = products[productIndex].pricing?.find(
                            (priceObj) => priceObj.band === band
                          )?.effectiveDate;
                          if (!dateVal) return today;
                          const formatted = new Date(dateVal)
                            .toISOString()
                            .split('T')[0];
                          return formatted < today ? today : formatted;
                        })()}
                        onChange={(e) =>
                          handleOnEnterPriceOrTax(e, band, 'priceEffectiveDate')
                        }
                        className="flex-1 w-1/3 rounded-md p-1 text-text-black"
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
          <div className="flex flex-col text-center gap-1 text-white">
            <span className="font-semibold text-base">
              Product Tax Configuration
            </span>
            <span className="text-sm text-yellow-500 w-full">
              Note: this is a product specific additional tax, on top of the tax
              charged in each tax band for this product. Check Tax Excluded to
              exempt this product from all taxes in individual taxband or in all
              tax bands.
            </span>
          </div>

          {/* Master toggle */}
          <div className="w-full bg-blue-shadow5 border-2 border-brand-blue rounded-lg p-3 mb-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-semibold text-white">
                Product excluded from all taxes in all tax bands?
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
                (taxBand) =>
                  taxBand !== null && (
                    <div
                      key={taxBand._id}
                      className="flex flex-col border border-gray-border rounded-lg p-2 bg-blue-shadow4"
                    >
                      <div className="flex flex-row items-center justify-between mb-2">
                        <span className="font-semibold text-base text-white">
                          {taxBand.name}
                        </span>

                        {products[productIndex].productTax?.find(
                          (taxObj) => taxObj.taxBand === taxBand._id
                        )?.isTaxExcluded && (
                          <span className="text-yellow-500 italic text-sm">
                            product is excluded from all taxes in this band...
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">
                            Tax Excluded?
                          </span>
                          <input
                            type="checkbox"
                            checked={
                              products[productIndex].productTax?.find(
                                (taxObj) => taxObj.taxBand === taxBand._id
                              )?.isTaxExcluded ?? false
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
                                )?.taxPercentage ?? ''
                              }
                              onChange={(e) =>
                                handleOnEnterPriceOrTax(e, taxBand, 'tax')
                              }
                              placeholder="0.00"
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
                                )?.additionalTaxAmount ?? ''
                              }
                              onChange={(e) =>
                                handleOnEnterPriceOrTax(
                                  e,
                                  taxBand,
                                  'additional'
                                )
                              }
                              placeholder="0.00"
                              className="flex-1 rounded-md p-1 text-text-black"
                            />
                          </div>
                          <div className="flex flex-row gap-2 items-center">
                            <span className="text-white text-sm w-32">
                              Effective date:
                            </span>
                            <input
                              type="date"
                              min={today}
                              value={(() => {
                                const dateVal = products[
                                  productIndex
                                ].productTax?.find(
                                  (taxObj) => taxObj.taxBand === taxBand._id
                                )?.effectiveDate;
                                if (!dateVal) return today;
                                const formatted = new Date(dateVal)
                                  .toISOString()
                                  .split('T')[0];
                                return formatted < today ? today : formatted;
                              })()}
                              onChange={(e) =>
                                handleOnEnterPriceOrTax(
                                  e,
                                  taxBand,
                                  'taxEffectiveDate'
                                )
                              }
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
            className={`${activeTab === tabs[0] && 'opacity-50 cursor-not-allowed'} p-2 text-brand-blue bg-text-white w-fit rounded-l-md hover:bg-blue-shadow9`}
          >
            {`< Prev`}
          </button>

          {activeTab === tabs[tabs.length - 1] ? (
            <button
              onClick={handleDone}
              className="py-2 px-4 text-brand-blue bg-text-white w-fit rounded-md hover:bg-blue-shadow9"
            >
              Done
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={activeTab === tabs[tabs.length - 1]}
              className={`${activeTab === tabs[tabs.length - 1] && 'opacity-50 cursor-not-allowed'} p-2 text-brand-blue bg-text-white w-fit rounded-r-md hover:bg-blue-shadow9`}
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
