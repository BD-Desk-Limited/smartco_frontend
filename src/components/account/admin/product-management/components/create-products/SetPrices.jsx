import ErrorInterface from '@/components/account/errorInterface';
import React, { useState } from 'react';

const SetPrices = ({
  products, 
  setProducts,
  productIndex, 
  bands, 
  taxBands, 
  bandsError,
  setBandsError,
  closePriceDropdown
}) => {

  const [activeTab, setActiveTab] = useState('prices');
  

  const tabs = [
    'prices',
    'tax',
  ];

  // Initialize tax bands with 0 values by default
  React.useEffect(() => {
    if (taxBands && taxBands.length > 0) {
      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts];
        const productToUpdate = updatedProducts[productIndex];

        if (!productToUpdate.productTax) {
          productToUpdate.productTax = [];
        }

        const validTaxBands = taxBands.filter(taxBand => taxBand !== null);
        
        validTaxBands.forEach(taxBand => {
          const existingTaxIndex = productToUpdate.productTax.findIndex(
            taxObj => taxObj.taxBand === taxBand._id
          );
          
          if (existingTaxIndex === -1) {
            productToUpdate.productTax.push({
              taxBand: taxBand._id,
              taxPercentage: 0,
              additionalTaxAmount: 0
            });
          }
        });

        return updatedProducts;
      });
    }
  }, [taxBands, productIndex, setProducts]);

  const handleNext = (e) => {
    e.preventDefault();

    const currentTabIndex = tabs.findIndex(tab => tab === activeTab);

    if(currentTabIndex !== -1 && currentTabIndex !== tabs.length-1){
      setActiveTab(tabs[currentTabIndex+1])
    };
    return;
  };

  const handlePrev = (e) => {
    e.preventDefault();

    const currentTabIndex = tabs.findIndex(tab => tab === activeTab);

    if(currentTabIndex !== -1 && currentTabIndex !== 0){
      setActiveTab(tabs[currentTabIndex-1])
    };
    return
  };

  const handleOnEnterPriceOrTax = (e, band, type) => {
    const inputValue = e.target.value;
    const value = inputValue === '' ? 0 : parseFloat(inputValue);
    
    // Check for NaN and default to 0
    const safeValue = isNaN(value) ? 0 : value;

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      const productToUpdate = updatedProducts[productIndex];

      if (type === 'price') {
        if (!productToUpdate.pricing) {
          productToUpdate.pricing = [];
        }
        const bandIndex = productToUpdate.pricing.findIndex(priceObj => priceObj.band === band);
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
          taxObj => taxObj.taxBand === band._id
        );
        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].taxPercentage = safeValue;
        } else {
          productToUpdate.productTax.push({ taxBand: band._id, taxPercentage: safeValue, additionalTaxAmount: 0 });
        }
      } else if (type === 'additional') {
        if (!productToUpdate.productTax) {
          productToUpdate.productTax = [];
        }
        const taxBandIndex = productToUpdate.productTax.findIndex(
          taxObj => taxObj.taxBand === band._id
        );
        if (taxBandIndex !== -1) {
          productToUpdate.productTax[taxBandIndex].additionalTaxAmount = safeValue;
        } else {
          productToUpdate.productTax.push({ taxBand: band._id, additionalTaxAmount: safeValue, taxPercentage: 0 });
        }
      }
    
      return updatedProducts;
    });
  };

  const handleDone = (e) => {
    e.preventDefault();
    setBandsError(prev => ({...prev, [productIndex]: ''}));

    //check if all bands have prices
    const productToCheck = products[productIndex];

    //filter out null bands
    const validBands = bands.filter(band => band !== null);

    //check if all bands have prices set
    const allBandsHavePrices = validBands.every(band => {
      const priceObj = productToCheck.pricing?.find(price => price.band === band);
      return priceObj && priceObj.price > 0;
    });

    if (!allBandsHavePrices) {
      setBandsError(prev => ({...prev, [productIndex]: 'Please set a price for all bands.'}));
      setActiveTab('prices');
      return;
    }
    //filter out null tax bands
    const validTaxBands = taxBands.filter(taxBand => taxBand !== null);

    //check if all tax bands have tax percentage set
    const allTaxBandsSet = validTaxBands.every(taxBand => {
      const taxObj = productToCheck.productTax?.find(tax => tax.taxBand === taxBand._id);
      return taxObj && 
           (taxObj.taxPercentage !== undefined && taxObj.taxPercentage !== null) && 
           (taxObj.additionalTaxAmount !== undefined && taxObj.additionalTaxAmount !== null);
    });

    if (!allTaxBandsSet) {
      setBandsError(prev => ({...prev, [productIndex]: 'Please set tax percentage and additional amount for all tax bands. If no tax, set to 0.'}));
      setActiveTab('tax');
      return;
    }

    //if all validations pass, close the overlay
    closePriceDropdown();
    setBandsError('');
  };

  return (
   <>
    {/* set Prices */}
    {activeTab === 'prices' && (
      <div className='min-h-[30vh] flex flex-col py-3 px-1 w-full items-center gap-1'>
        <div className='flex flex-col text-center gap-1'>
          <span className='font-semibold text-base'>Product price for different bands</span>
          <span className='text-sm w-full'>set price for this product in all your store price bands</span>
        </div>

        {bandsError[productIndex] &&
          <span className='bg-white p-1 w-full font-semibold'>
            <ErrorInterface error={bandsError[productIndex]}/>
          </span>
        }

        {/* price inputs for each band */}
        <div className='flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto scrollbar-thin w-full'>
          {
            bands.length>1 &&
            bands.map((band, index) => (
              band !== null &&
              <li key={index} className='list-none w-full flex flex-row gap-1'>
                <span className='bg-blue-shadow4 p-2 rounded-md w-1/2'>
                  {band}
                </span>
            
                <input 
                  type='number'
                  min={0}
                  placeholder='0.00'
                  value={products[productIndex].pricing?.find(priceObj => priceObj.band === band)?.price || ''}
                  onChange={(e) => handleOnEnterPriceOrTax(e, band, 'price')}
                  className='w-1/2 rounded-md px-1 text-text-black'
                />
              </li>
            ))
          }
        </div>
      </div>
    )}

    {/* set tax rates */}
    {activeTab === 'tax' && (
      <div className='min-h-[30vh] flex flex-col py-3 px-1 w-full items-center gap-1'>
        <div className='flex flex-col text-center gap-1'>
          <span className='font-semibold text-base'> {`Product Tax (%)`}</span>
          <span className='text-sm w-full'>Is there an extra tax specifically charged on this products</span>
        </div>

        {bandsError[productIndex] &&
          <span className='bg-white p-1 w-full font-semibold'>
            <ErrorInterface error={bandsError[productIndex]}/>
          </span>
        }
        <div className='flex flex-col gap-2 p-2 max-h-[30vh] overflow-y-auto scrollbar-thin w-full'>
          {
            taxBands.length>1 &&
            taxBands.map((taxBand, index) => (
              taxBand !== null &&
              <div key={taxBand._id} className='flex flex-col'>
                <li className='list-none w-full flex flex-row gap-1 align-baseline'>
                  <span className='bg-blue-shadow4 p-2 rounded-md w-1/2'>
                    {taxBand.name}
                  </span>
                  <span className='flex font-bold items-center'>%</span>
                  <input 
                    type='number'
                    min={0}
                    max={100}
                    value={
                      products[productIndex].productTax?.find(
                        taxObj => taxObj.taxBand === taxBand._id
                      )?.taxPercentage || ''
                    }
                    onChange={(e) => handleOnEnterPriceOrTax(e, taxBand, 'tax')}
                    placeholder='0.00'
                    className='min-w-1/4 rounded-md p-1 text-text-black '
                  />

                  <span className='w-full flex flex-col items-center justify-center'>
                    <span>Additional fixed tax-amount</span>
                    <input 
                      type='number'
                      min={0}
                      value={
                        products[productIndex].productTax?.find(
                          taxObj => taxObj.taxBand === taxBand._id
                        )?.additionalTaxAmount || ''
                      }
                      onChange={(e) => handleOnEnterPriceOrTax(e, taxBand, 'additional')}
                      placeholder='$0.00'
                      className='rounded-md p-1 text-text-black'
                    />
                  </span>
                </li>
                <hr className='border border-gray-border my-0.5'/>
              </div>
            ))
          }
        </div>

      </div>
    )}

    {/* Buttons */}
    <div className='w-full my-2 flex flex-col gap-1 px-2'>

      <hr className='border border-blue-shadow4 w-full'/>
      
      <div className='w-full flex flex-row justify-between'>
        <button 
          onClick={handlePrev} 
          disabled={activeTab === tabs[0]}
          className={`
            ${activeTab === tabs[0] &&'opacity-50 cursor-not-allowed'} 
            p-2 text-brand-blue bg-text-white w-fit rounded-l-md hover:bg-blue-shadow9`
          }
        >
          {`< Prev`}
        </button>

        { activeTab === tabs[tabs.length - 1]? (
          <button 
            onClick={handleDone}
            className={`py-2 px-4 text-brand-blue bg-text-white w-fit rounded-md hover:bg-blue-shadow9`}
          >
            Done
          </button>
        ):(
          <button 
            onClick={handleNext} 
            disabled={activeTab === tabs[tabs.length - 1]}
            className={`
              ${activeTab === tabs[tabs.length - 1] &&'opacity-50 cursor-not-allowed'} 
              p-2 text-brand-blue bg-text-white w-fit rounded-r-md hover:bg-blue-shadow9`
            }
          >
            {`Next >`}
          </button>
        )}
      </div>
    </div>
   </>
  )
}

export default SetPrices;