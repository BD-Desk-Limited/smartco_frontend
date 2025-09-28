import React from 'react';
import Image from 'next/image';

const SelectComponents = ({ products, setProducts, productIndex, materials, closeComponentsDropdown, bands, showSelectComponents, setShowSelectComponents }) => {
  const [materialSearch, setMaterialSearch] = React.useState('');
  const [packagingSearch, setPackagingSearch] = React.useState('');
  const [altSearch, setAltSearch] = React.useState({});
  const [openAltSearch, setOpenAltSearch] = React.useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = React.useState(0);
  const alternativeMaterialRef = React.useRef(null);


  const safeMaterials = Array.isArray(materials) ? materials : []; // Ensure materials is always an array

  const currentProduct = products[productIndex];
  const rawMaterials = safeMaterials.filter(mat => mat.materialType === 'raw-material');
  const packagings = safeMaterials.filter(mat => mat.materialType === 'packaging');

  // Filter materials and packagings based on search input
  const filteredMaterials = materialSearch
    ? rawMaterials.filter(mat =>
        mat.name.toLowerCase().includes(materialSearch.toLowerCase())
      )
    : rawMaterials;

  // Filter packagings based on search input
  const filteredPackagings = packagingSearch
    ? packagings.filter(pack =>
        pack.name.toLowerCase().includes(packagingSearch.toLowerCase())
      )
    : packagings;

  // All materials filtered for selecting alternate materials based on search input
  const filteredAllMaterials = altSearch[productIndex]
    ? materials.filter(mat =>
        mat.name.toLowerCase().includes(altSearch[productIndex].toLowerCase())
      )
    : materials;

  // helper to create default additionalPrice array for each band
  const createDefaultPrices = () => bands && bands.filter(band=> band !== null).map(band => ({
    band: band,
    price: 0
  }));

  // add a new component (raw material or packaging)
  const handleAddComponent = (material, categoryName = '') => {
    setProducts(prev => {
      const updated = [...prev];
      const components = updated[productIndex].components || [];

      // Check if a component with the same material already exists
      const exists = components.some(comp =>(
        comp.materialChoices[0].material === material._id)
      );

      if (!exists) {
        const newComp = {
          categoryName,
          materialChoices: [{
            material: material._id,
            quantity: 1,
            additionalPrice: createDefaultPrices()
          }]
        };
        updated[productIndex].components = [...components, newComp];
        // Set currentComponentIndex to the last index (newly added component)
        setCurrentComponentIndex(updated[productIndex].components.length - 1);
      }
      return updated;
    });

    // Reset search and close dropdown
    setShowSelectComponents(prev => ({...prev, [productIndex]: true}));
    setMaterialSearch('');
    setPackagingSearch('');
  };

  // add alternate material to component
  const handleAddAlternate = (material, compIndex) => {
    setProducts(prev => {
      const updated = [...prev];
      const comps = updated[productIndex].components || [];
      if (!comps[compIndex]) return prev;

      const targetComp = comps[compIndex];
      const already = targetComp.materialChoices.some(mc => mc.material === material._id);
      if (!already) {
        targetComp.materialChoices.push({
          material: material._id,
          quantity: 1,
          additionalPrice: createDefaultPrices()
        });
      }
      return updated;
    });

    // Scroll to the newly added material
    setTimeout(() => {
      if (alternativeMaterialRef.current) {
        const lastAlternative = alternativeMaterialRef.current.lastElementChild;
        if (lastAlternative) {
          lastAlternative.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
          });
        }
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  // update quantity of a materialChoice
  const handleUpdateQuantity = (compIndex, choiceIndex, quantity) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[productIndex].components[compIndex].materialChoices[choiceIndex].quantity = quantity;
      return updated;
    });
  };

  // remove a materialChoice
  const handleRemoveMaterial = (compIndex, choiceIndex) => {
    setProducts(prev => {
      const updated = [...prev];
      const components = updated[productIndex].components.map((comp, idx) => {
        if (idx !== compIndex) return comp;
        // Remove the materialChoice at choiceIndex
        const newChoices = comp.materialChoices.filter((_, i) => i !== choiceIndex);
        return { ...comp, materialChoices: newChoices };
      }).filter(comp => comp.materialChoices.length > 0);
      updated[productIndex].components = components;
      return updated;
    });
  };

  // Keep currentComponentIndex in bounds after products/components change
  React.useEffect(() => {
    const comps = products[productIndex]?.components || [];
    if (currentComponentIndex > comps.length - 1) {
      setCurrentComponentIndex(comps.length > 0 ? comps.length - 1 : 0);
    }
  }, [products, productIndex, currentComponentIndex]);
  
  // remove entire component
  const handleRemoveComponent = (compIndex) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[productIndex].components.splice(compIndex, 1);
      return updated;
    });
  };

  // update category name
  const handleUpdateCategoryName = (compIndex, value) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[productIndex].components[compIndex].categoryName = value;
      return updated;
    });
  };

  // update band price
  const handleUpdateBandPrice = (compIndex, choiceIndex, bandIndex, price) => {
    setProducts(prev => {
      const updated = [...prev];
      updated[productIndex].components[compIndex].materialChoices[choiceIndex].additionalPrice[bandIndex].price = price;
      return updated;
    });
  };


  return (
    <div className="min-h-[40vh] flex flex-col py-3 px-1 w-full items-center gap-2 relative">
      <span className="text-base font-semibold text-white w-full text-center">Select the components that make up this product</span>

      {/* component counter */}
      <span 
        onClick={() => setShowSelectComponents(prev => ({...prev, [productIndex]: true}))}
        className='absolute top-2 right-2 font-bold bg-error p-1'
      >
        {`${currentComponentIndex + 1} / ${currentProduct?.components?.length || 0}`}
      </span>

      {!showSelectComponents[productIndex] || (!currentProduct?.components || currentProduct.components.length === 0) ? (
        <div className="flex w-full gap-4">
          {/* Raw Materials */}
          <div className="w-1/2 flex flex-col">
            <span className="text-sm text-text-white">Select Materials</span>
            <div className="flex items-center bg-gray-shadow9 border border-gray-border rounded px-2">
              <Image src="/assets/search.png" alt="search" width={16} height={16}/>
              <input
                value={materialSearch || ''}
                onChange={e => setMaterialSearch(e.target.value)}
                placeholder="search materials..."
                className="bg-transparent outline-none p-1 w-full text-sm text-text-gray"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mt-2 scrollbar-thin">
              {filteredMaterials.map((mat, i) => (
                <div
                  key={i}
                  className="border border-gray-border rounded-md px-2 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 hover:text-brand-blue"
                  onClick={() => handleAddComponent(mat)}
                >
                  {mat.name}
                </div>
              ))}
              {filteredMaterials.length === 0 && <div className="text-red-400 text-sm">No materials found!</div>}
            </div>
          </div>

          {/* Packaging */}
          <div className="w-1/2 flex flex-col">
            <span className="text-sm text-text-white">Select Packaging</span>
            <div className="flex items-center bg-gray-shadow9 border border-gray-border rounded px-2">
              <Image src="/assets/search.png" alt="search" width={16} height={16}/>
              <input
                value={packagingSearch || ''}
                onChange={e => setPackagingSearch(e.target.value)}
                placeholder="search packaging..."
                className="bg-transparent outline-none p-1 w-full text-sm text-text-gray"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mt-2 scrollbar-thin">
              {filteredPackagings.map((mat, i) => (
                <div
                  key={i}
                  className="border border-gray-border rounded-md px-2 py-1 text-sm text-white cursor-pointer hover:bg-gray-200 hover:text-brand-blue"
                  onClick={() => handleAddComponent(mat, 'Packaging')}
                >
                  {mat.name}
                </div>
              ))}
              {filteredPackagings.length === 0 && <div className="text-red-400 text-sm">No packaging found!</div>}
            </div>
          </div>
        </div>
      ):(
        <div className="w-full flex flex-row gap-2 justify-between items-center">

          {/* Navigation buttons back and prev component */}
          {currentComponentIndex === 0 ? 
            <span 
              onClick={() => setShowSelectComponents(prev => ({...prev, [productIndex]: !prev[productIndex]}))}
              className='text-center text-xs text-blue-shadow2 bg-text-white rounded-full py-4 px-2 cursor-pointer shadow-md shadow-gray-border hover:bg-blue-shadow8'
            >
              Back
            </span>:
            <span onClick={() => setCurrentComponentIndex(prev => prev - 1)} className="text-center text-xs text-blue-shadow2 bg-text-white rounded-full py-4 px-2 cursor-pointer shadow-md shadow-gray-border hover:bg-blue-shadow8">{`<< prev`}</span>
          }

          {/* Display current component for editing */}
          {currentProduct?.components?.map((comp, compIdx) => (
            <div key={compIdx} >
              {currentComponentIndex === compIdx &&
              <div className="border border-gray-border rounded-lg p-2 bg-blue-shadow4 text-white relative w-full">
                {/* Material Choices category Name*/}
                <div className="flex gap-1 items-center">
                  <span className="font-semibold">Category Title: </span>
                  <input
                    type="text"
                    value={comp.categoryName || ''}
                    onChange={(e) => handleUpdateCategoryName(compIdx, e.target.value)}
                    placeholder="Enter category Title..."
                    className="bg-transparent border-b border-gray-border outline-none text-base w-fit"
                  />
                </div>
                <button 
                  onClick={() => handleRemoveComponent(compIdx)} 
                  className="text-red-500 text-base font-bold bg-text-white p-2 rounded-full hover:bg-red-100 absolute right-0 top-0"
                  title="Remove component"
                >
                  X
                </button>
              
                {/* Material Choices */}
                <div 
                  ref={alternativeMaterialRef}
                  className="flex flex-wrap overflow-y-auto scrollbar-thin max-h-[35vh] gap-4 mt-2"
                >
                  {comp.materialChoices.map((mc, choiceIdx) => {
                    // Find the material details from safeMaterials
                    const mat = safeMaterials.find(m => m._id === mc.material);
                    return (
                      <div key={choiceIdx} className="px-2 border border-gray-border rounded-md bg-gray-shadow7 text-black flex flex-col items-center">
                        {/* Remove material choice button */}
                        <button 
                          onClick={() => handleRemoveMaterial(compIdx, choiceIdx)} 
                          className="text-error text-base font-bold bg-text-white px-8 py-0.5 rounded-full hover:bg-red-100"
                          title="Remove material choice"
                        >
                          X
                        </button>
                        {/* Material details */}
                        <Image src={mat.imageURL || '/assets/edit-material.png'} alt={mat.name} width={40} height={40} className="rounded-full" />
                        <span className="text-sm font-semibold">{mat?.name}</span>
                        <span>
                          <em className="text-sm font-bold">Qty:</em>{' '}
                          <input
                            type="number"
                            min={1}
                            value={mc.quantity || ''}
                            onChange={e => handleUpdateQuantity(compIdx, choiceIdx, parseFloat(e.target.value))}
                            className="mt-1 w-16 text-center p-1 border rounded"
                          />
                          {/* find unit of measurement that tallies with the material */}
                          <em className="text-sm font-bold">
                            {safeMaterials.find(m => m._id === mc.material)?.unitOfMeasurement?.name}
                          </em>
                        </span>
                    
                        {/* Band prices */}
                        {comp.materialChoices.length > 1 && (
                          <div className="mt-2 flex flex-col gap-1 border border-gray-border p-1 rounded-md bg-gray-100 overflow-y-auto max-h-36 scrollbar-thin">
                            <span className="text-xs font-semibold w-full text-center sticky top-[-3%] bg-text-white">
                              Additional Price for this option:
                            </span>
                        
                            {mc.additionalPrice.map((band, bandIdx) => (
                              <div key={bandIdx} className="flex items-center gap-1">
                                <span className="text-xs">{band.band}:</span>
                                <input
                                  type="number"
                                  value={
                                    isNaN(parseFloat(band.price)) || band.price === null || band.price === undefined
                                      ? ''
                                      : parseFloat(band.price)
                                  }
                                  onChange={(e) => handleUpdateBandPrice(compIdx, choiceIdx, bandIdx, parseFloat(e.target.value))}
                                  className="w-16 text-center p-0.5 border rounded"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Alternate material search */}
                <div className="mt-2">
                  {!openAltSearch ? (
                    <span className="text-sm text-gray-200 cursor-pointer">
                      Does this component have alternatives? 
                      <button onClick={() => setOpenAltSearch(true)} className="text-brand-blue bg-text-white p-1 rounded ml-1 hover:bg-blue-shadow1 shadow-md hover:text-text-white">
                        Add alternatives
                      </button>
                    </span>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <input
                          value={altSearch[productIndex] || ''}
                          type='text'
                          onChange={e => setAltSearch(prev => ({...prev, [productIndex]: e.target.value}))}
                          placeholder="search alternate materials..."
                          className="w-full border border-gray-border rounded p-1 text-sm text-black"
                        />
                      </div>
                  
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto bg-blue-shadow1 px-2 rounded-b shadow-md mt-1 relative scrollbar-thin my-[-10px]">
                        <button 
                          className="text-red-500 text-base font-bold bg-text-white p-2 rounded-full hover:bg-red-100 left-0 top-0 shadow-md sticky"
                          title="Remove component" 
                          onClick={() => setOpenAltSearch(false)}
                        >
                          X
                        </button>
                        {filteredAllMaterials.map((mat, idx) => (
                          <div
                            key={idx}
                            className="px-2 py-1 border rounded cursor-pointer hover:bg-brand-blue hover:text-white"
                            onClick={() => handleAddAlternate(mat, compIdx)}
                          >
                            {mat.name}
                          </div>
                        ))}
                        {filteredAllMaterials.length === 0 && <div className="text-red-500 text-sm">No materials found</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            }
          </div>))}
          
          {/* Navigation buttons next and add more components */}
          {currentComponentIndex === currentProduct?.components.length - 1 ?
            <span 
              onClick={()=> setShowSelectComponents(prev => ({...prev, [productIndex]: false}))}
              className='text-center text-xs text-blue-shadow2 bg-text-white rounded-full py-4 px-2 cursor-pointer shadow-md shadow-gray-border hover:bg-blue-shadow8'
            > 
              Add another component
            </span> :
            <span 
              onClick={() => setCurrentComponentIndex(prev => prev + 1)}
              className='text-center text-xs text-blue-shadow2 bg-text-white rounded-full py-4 px-2 cursor-pointer shadow-md shadow-gray-border hover:bg-blue-shadow8'
            >
              {`next >>`}
            </span>
          }
        </div>
      )}

      {/* Close dropdown */}
      <button
        onClick={closeComponentsDropdown}
        className="mt-4 px-4 py-2 text-brand-blue bg-white hover:bg-blue-shadow8 rounded-lg"
      >
        Done
      </button>
    </div>
  )
}

export default SelectComponents;