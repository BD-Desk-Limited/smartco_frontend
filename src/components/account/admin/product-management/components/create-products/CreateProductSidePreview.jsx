import React from 'react';

const componentMaterials = [
    { _id: 1, name: 'Material A', quantity: 2, unit: 'kg' },
    { _id: 2, name: 'Material B', quantity: 5, unit: 'm' },
    { _id: 3, name: 'Material C', quantity: 10, unit: 'pcs' },
    { _id: 4, name: 'Material D', quantity: 3, unit: 'ltr' },
    { _id: 5, name: 'Material E', quantity: 7, unit: 'g' },
];

const packaging = [
    { _id: 1, name: 'Box', quantity: 5, unit: 'pcs' },
    { _id: 2, name: 'Bag', quantity: 10, unit: 'pcs' },
    { _id: 3, name: 'Wrap', quantity: 15, unit: 'pcs' },
];

const componentProducts = [
    { _id: 1, name: 'Component A', quantity: 2, unit: 'pcs' },
    { _id: 2, name: 'Component B', quantity: 1, unit: 'pcs' },
    { _id: 3, name: 'Component C', quantity: 4, unit: 'pcs' },
];

const CreateProductSidePreview = ({ selectedProduct, taxBands }) => {

  // Filter tax info with taxPercentage > 0 or additionalTaxAmount > 0 to avoid unnecessary rendering of zero tax bands.
  const taxInfo = selectedProduct?.productTax?.length > 0
    ? selectedProduct.productTax.filter(
        tax => (tax.taxPercentage > 0 || tax.additionalTaxAmount > 0)
      )
    : [];

  const findTaxBandDetails = (taxBandId) => {
    return taxBands.find(taxBand => taxBand._id === taxBandId);
  };

  return (
    <div className='max-h-[99%] min-h-[99%] overflow-y-auto scrollbar-thin bg-brand-blue rounded-md text-text-white px-3 relative'>
        <h2 className='text-base font-semibold sticky top-0 py-2 bg-brand-blue'>{selectedProduct?.name || 'Product Preview'}</h2>
        <span className='text-sm italic font-semibold'>
          {`Product Category - ${selectedProduct?.category || 'N/A'}`}
        </span>

        {/* components */}
        <div className='bg-blue-shadow4 rounded-md p-3 mt-2 min-h-[50%] flex flex-col justify-between gap-2'>
          <div>
            <span className='text-sm font-bold'>Component Materials</span>

            <ul className='max-h-32 overflow-y-auto scrollbar-thin'>
              {componentMaterials.length > 0 ? (
                componentMaterials.map((material) => (
                  <li key={material._id} className='text-sm font-mono px-1 flex flex-row gap-1 justify-between'>
                    <span>{material.name}</span>
                    <span className=''>{`${material.quantity} ${material.unit || 'N/A'}`}</span>
                  </li>
                ))
              ) : (
                <p className='text-sm italic text-center py-4'>No materials selected!!</p>
              )}
            </ul>
          </div>

          <div>
            <span className='text-sm font-bold'>Packaging</span>

            <ul className='max-h-32 overflow-y-auto scrollbar-thin'>
              {packaging.length > 0 ? (
                packaging.map((pack) => (
                  <li key={pack._id} className='text-sm font-mono px-1 flex flex-row gap-1 justify-between'>
                    <span>{pack.name}</span>
                    <span className=''>{`${pack.quantity} ${pack.unit || 'N/A'}`}</span>
                  </li>
                ))
              ) : (
                <p className='text-sm italic text-center py-4'>No packaging selected!!</p>
              )}
            </ul>
          </div>
        </div>

        {/* price */}
        <div className='my-1 text-sm flex flex-col gap-2'>
          <hr />
          <h2 className='sticky top-0 font-semibold'>Price (Gross)</h2>

          <ul className='max-h-32 overflow-y-auto scrollbar-thin'>
            {selectedProduct?.pricing && selectedProduct.pricing.length > 0 ? (
              selectedProduct.pricing.map((price, index) => (
                <li key={index} className='text-sm font-mono px-1 flex flex-row gap-1 justify-between'>
                  <span className=''>{price.band || 'N/A'}</span>
                  <span className='font-bold'>{`${(price.price || 0).toFixed(2)}`}</span>
                </li>
              ))
            ) : (
              <p className='text-sm italic text-center py-4'>No pricing information set!!</p>
            )}
          </ul>

          <hr />
        </div>

        {/* tax */}
        <div className='text-sm flex flex-col gap-2 my-2'>
          <hr />
            <ul className='max-h-32 overflow-y-auto scrollbar-thin'>
              <h2 className='sticky top-0 font-semibold'>Tax Information</h2>
              {taxInfo.length > 0 ? (
                taxInfo.map((tax, idx) => (
                  <li key={tax._id || idx} className='text-sm font-mono px-1 flex flex-row gap-1 justify-between my-1 bg-blue-shadow4'>
                    <span>
                      {findTaxBandDetails(tax.taxBand)? findTaxBandDetails(tax.taxBand).name : 'N/A'}
                    </span>
                    <span>
                      {`${tax.taxPercentage || 0}% `} 
                      {tax.additionalTaxAmount > 0 && (
                        <span>{`+ ${tax.additionalTaxAmount || 0}`}</span>
                      )}
                    </span>
                  </li>
                ))
              ) : (
                <p className='text-sm italic text-center py-4'>No tax information set!!</p>
              )}
            </ul>
          <hr />
        </div>

    </div>
  )
}

export default CreateProductSidePreview;