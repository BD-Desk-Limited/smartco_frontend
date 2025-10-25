import React from 'react';

const CreateProductSidePreview = ({ selectedProduct, taxBands, materials }) => {

  // Filter tax info with taxPercentage > 0 or additionalTaxAmount > 0 to avoid unnecessary rendering of zero tax bands.
  const taxInfo = selectedProduct?.productTax?.length > 0
    ? selectedProduct.productTax.filter(
        tax => (tax.taxPercentage > 0 || tax.additionalTaxAmount > 0)
      )
    : [];

  const findTaxBandDetails = (taxBandId) => {
    return taxBands.find(taxBand => taxBand._id === taxBandId);
  };

  const components = selectedProduct?.components || [];

  // Helper function to get material name by material ID
  const getMaterialName = (materialId) => {
    const material = materials.find(mat => mat._id === materialId);
    return material ? material.name : 'Unknown Material';
  };

  // Helper function to get material units by material ID
  const getMaterialUnits = (materialId) => {
    const material = materials.find(mat => mat._id === materialId);
    return material ? material.unitOfMeasurement?.name : '';
  };

  return (
    <div className='max-h-[99%] min-h-[99%] overflow-y-auto scrollbar-thin bg-brand-blue rounded-md text-text-white px-3 relative'>
        <h2 className='text-base font-semibold sticky top-0 py-2 bg-brand-blue'>{selectedProduct?.name || 'Product Preview'}</h2>
        <span className='text-sm italic font-semibold'>
          {`Product Category - ${selectedProduct?.category || 'N/A'}`}
        </span>

        {/* components */}
        <div className='bg-blue-shadow4 rounded-md p-3 mt-2 min-h-[50%] flex flex-col justify-between gap-2'>
          <span className='text-sm font-bold'>Component Materials</span>
          <ul className='max-h-32 overflow-y-auto scrollbar-thin'>
            {components.length > 0 ? (
              components.map((component, index) => (
                <li key={index} className='text-sm font-mono px-1 flex flex-col gap-1 justify-between'>
                  <span className='font-semibold underline'>{component.categoryName || ' '}</span>
                  {/* map material choices under each component */}
                  <span className=' p-1'>
                    {component.materialChoices.length > 0 && 
                      component.materialChoices.map((mat, idx) => (
                        <span key={idx} className='flex flex-col'>
                          <span className='flex flex-row justify-between'>
                            <span>{getMaterialName(mat.material)}</span> 
                            <span>{mat.quantity} {getMaterialUnits(mat.material)}</span>
                          </span>
                          {idx < component.materialChoices.length - 1 && 
                            component.materialChoices.length > 1 && 
                            <em className='w-full mx-2'>or</em>
                          }
                        </span>
                      ))
                    }
                  </span>
                  
                </li>
              ))
            ) : (
              <p className='text-sm italic text-center py-4'>No materials selected!!</p>
            )}
          </ul>
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
              <h2 className='sticky top-0 font-semibold bg-brand-blue py-0.5'>Tax Information</h2>
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
                <p className='text-sm italic text-center py-4'>No additional tax information set!!</p>
              )}
            </ul>
          <hr />
        </div>

    </div>
  )
}

export default CreateProductSidePreview;