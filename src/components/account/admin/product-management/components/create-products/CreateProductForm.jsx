import Image from 'next/image';
import React from 'react'
import AddPicture from './AddPicture';
import SetPrices from './SetPrices';
import SelectComponents from './SelectComponents';
import AddDescription from './AddDescription';

const CreateProductForm = ({
  products, 
  setProducts, 
  productCategories, 
  setSelectedProduct, 
  emptyForm, 
  bands,
  taxBands,
  bandsError,
  setBandsError,
  setBands,
  setTaxBands,
  materials,
  setMaterials,
  handleCreateProduct
}) => {

  const [categorySearch, setCategorySearch] = React.useState({});
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState({});
  const [addNewCategory, setAddNewCategory] = React.useState({});
  const [newCategoryName, setNewCategoryName] = React.useState({});
  const [componentsDropDown, setComponentsDropDown] = React.useState({});
  const [openPriceDropDown, setOpenPriceDropDown] = React.useState({});
  const [openAddPictureOverlay, setOpenAddPictureOverlay] = React.useState({});
  const [openAddProductDescription, setOpenAddProductDescription] = React.useState({});
  const [showSelectComponents, setShowSelectComponents] = React.useState({});
  const productRefs = React.useRef([]);

  
  const handleOpenDropdown = (index, handlerFunction) => {
    handlerFunction(prev => {
      const wasOpen = !!prev[index];
      // Only toggle the clicked dropdown
      return { [index]: !wasOpen };
    });
    if(handlerFunction === componentsDropDown){
      setShowSelectComponents(prev => ({...prev, [index]: false}));
    };
    // Now close all other dropdowns
    if (handlerFunction !== setCategoryDropdownOpen) setCategoryDropdownOpen({});
    if (handlerFunction !== setComponentsDropDown) setComponentsDropDown({});
    if (handlerFunction !== setOpenPriceDropDown) setOpenPriceDropDown({});
    if (handlerFunction !== setOpenAddPictureOverlay) setOpenAddPictureOverlay({});
    if (handlerFunction !== setOpenAddProductDescription) setOpenAddProductDescription({});
  };
  const handleRemoveProduct = (productIndex) => {
    if (products?.length > 1) {
      setProducts(prev => 
        prev.filter(
          (_, idx) => idx !== productIndex
        )
      );
    } else {
      setProducts([emptyForm]);
    }
  };
  const handleChoseCategory = (productIndex, categoryObj) => {
    setProducts(prev =>
      prev.map((p, i) =>
        i === productIndex ? { ...p, category: categoryObj.name } : p
      )
    );
    setCategorySearch(prev => ({...prev, [productIndex]: ''}));
    setCategoryDropdownOpen(prev => ({...prev, [productIndex]: false}));
    setAddNewCategory(prev => ({...prev, [productIndex]: false}));
    setNewCategoryName(prev => ({...prev, [productIndex]: ''}));
  };
  const handleEnterNewCategory = (productIndex) => {
    setProducts(prev =>
      prev.map((p, i) =>
        i === productIndex ? { ...p, category: newCategoryName[productIndex] } : p
      )
    );
    setCategorySearch(prev => ({...prev, [productIndex]: ''}));
    setCategoryDropdownOpen(prev => ({...prev, [productIndex]: false}));
    setAddNewCategory(prev => ({...prev, [productIndex]: false}));
    setNewCategoryName(prev => ({...prev, [productIndex]: ''}));
  };
  const handleAddMoreProduct = () => {
    setProducts(prev => {
      const newProducts = [...prev, emptyForm];
      //use useRef to make page scroll to the newly added form
      setTimeout(() => {
        const lastIndex = newProducts.length - 1;
        if (productRefs.current[lastIndex]) {
          productRefs.current[lastIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100); // Delay to ensure DOM update
      return newProducts;
    });
    
    setOpenAddPictureOverlay({})
    setOpenAddProductDescription({})
  };
  const handleResetForm = ()=>{
    setProducts([emptyForm])
    setOpenAddPictureOverlay({})
    setOpenAddProductDescription({})
  };
    
  return (
    <div className='h-full bg-white rounded-lg p-3 text-text-gray'>
        <span className='font-semibold text-sm'>Create New Product</span>

        {/* Form Fields */}
        <form className="flex flex-col my-5">
            { products.length>0 &&
                products.map((product, index) => (
                    <div
                      className="flex flex-row w-full"
                      key={index}
                      ref={el => productRefs.current[index] = el}
                    >
                        {/* each product form */}
                        <div 
                          className="flex flex-col w-full hover:bg-gray-shadow9 p-2 rounded-lg relative"
                          onClick={()=>setSelectedProduct(product)}
                        >
                            {/* Remove button */}
                            <div 
                              onClick={()=>handleRemoveProduct(index)}
                              title='Remove product'
                              className='absolute top-0 right-0 px-1 py-0.5 rounded-[100%] bg-error text-white font-bold cursor-pointer'
                            >
                              X
                            </div>

                            {/* Input Fields */}
                            <div className="flex flex-row gap-5 mb-2 w-full">
                                {/** Product Name **/}
                                <div className="flex gap-1 flex-col w-1/3">
                                    <label className="text-sm font-thin text-text-black" htmlFor={`product-name-${index}`}>Product Name</label>
                                    <input
                                      type="text"
                                      id={`product-name-${index}`}
                                      value={product.name}
                                      onChange={(e) =>
                                        setProducts(prev =>
                                            prev.map(
                                                (p, i) => i === index ? {
                                                    ...p, name: e.target.value
                                                } : p
                                            )
                                        )
                                      }
                                      placeholder="Enter product Name"
                                      className="border border-gray-border rounded-md p-2 focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                                    />
                                </div>

                                {/* Product Category */}
                                <div className="flex gap-1 flex-col min-w-1/5">
                                    <label className="text-sm font-thin text-text-black">
                                        Category
                                    </label>
                                    <div className="relative border border-gray-border rounded-md p-2 text-sm text-text-gray mb-1 cursor-pointer w-full">
                                        <div 
                                          onClick={() => handleOpenDropdown(index, setCategoryDropdownOpen)} 
                                          className="flex flex-row items-center justify-between gap-2"
                                        >
                                            <span className='py-0.5'>{product.category ||'select a product category'}</span>
                                            <Image
                                              src={`${ categoryDropdownOpen[index]? '/assets/arrow_left_dark.png':'/assets/arrow_down_dark.png'}`}
                                              alt='drop down'
                                              width={8}
                                              height={8}
                                            />
                                        </div>
                                        {categoryDropdownOpen[index] && (
                                          <ul className="absolute z-10 top-9 left-0 bg-white border border-gray-border rounded-md shadow-md flex flex-col min-w-40">
                                            <li className='flex flex-row items-center justify-center rounded-xl bg-gray-shadow9 m-1 px-1 border border-gray-border'>
                                                <Image
                                                  src={`/assets/search.png`}
                                                  alt='search'
                                                  width={16}
                                                  height={16}
                                                />
                                                <input
                                                    type='text'
                                                    value={categorySearch[index] || ''}
                                                    onChange={(e)=>setCategorySearch(prev => ({...prev, [index]:e.target.value}))}
                                                    placeholder='Search categories'
                                                    className='py-1 bg-transparent rounded-xl w-3/4 p-2 focus:outline-none text-sm text-text-gray focus:ring-0'
                                                />
                                            </li>
                                            <li className='max-h-80 overflow-y-auto  scrollbar-thin my-0.5 flex flex-col'>
                                              {productCategories
                                                .filter(cat =>
                                                  cat?.name?.toLowerCase()?.includes(categorySearch[index]?.toLowerCase() || '')
                                                )
                                                .map(category => (
                                                  <span
                                                    key={category._id}
                                                    className="p-2 text-sm cursor-pointer hover:bg-brand-blue hover:text-white"
                                                    onClick={()=>handleChoseCategory(index, category)}
                                                  >
                                                    {category.name}
                                                  </span>
                                              ))}
                                            </li>
                                            <li className='w-full text-center my-2'>
                                              {addNewCategory[index]? (
                                                <span className='flex flex-col gap-1 justify-center items-center'>
                                                  <input
                                                    type='text'
                                                    value={newCategoryName[index] || ''}
                                                    onChange={(e)=>setNewCategoryName((prev => ({...prev, [index]: e.target.value})))}
                                                    placeholder='enter category name'
                                                    className='rounded-lg p-2 mx-2 border border-gray-border focus:outline-brand-blue text-sm text-text-gray focus:ring-1 focus:ring-brand-blue'
                                                  />
                                                  <span onClick={()=>handleEnterNewCategory(index)} className='py-1 px-2 w-fit text-text-white rounded-md bg-brand-blue'>
                                                    Enter
                                                  </span>
                                                </span>
                                              ):(
                                                <span 
                                                  onClick={()=>setAddNewCategory((prev => ({...prev, [index]: true})))} 
                                                  className='text-brand-blue p-1 rounded-md mx-1 text-center font-bold flex flex-row items-center justify-center gap-1 border border-brand-blue'
                                                >
                                                  <Image
                                                    src={`/assets/add_blue.png`}
                                                    width={16}
                                                    height={16}
                                                    alt='add new category'
                                                  />
                                                  <span className='w-full'>Add new category</span>
                                                </span>
                                              )}
                                            </li>
                                          </ul>
                                        )}
                                    </div>
                                </div>

                                {/** Set price **/}
                                <div className="flex gap-1 flex-col w-1/7">
                                  <label className="text-sm font-thin text-text-white">
                                      ''
                                  </label>
                                  <div className={`relative border border-gray-border rounded-md p-2 text-sm text-text-white bg-brand-blue mb-1 cursor-pointer w-full shadow-md ${openPriceDropDown[index]? 'pb-5':''}`}>
                                    <div 
                                      onClick={() =>handleOpenDropdown(index, setOpenPriceDropDown)} 
                                      className="flex flex-row items-center justify-between gap-1"
                                    >
                                      <Image
                                        src={'/assets/add_white.png'}
                                        alt='add'
                                        width={16}
                                        height={16}
                                      />
                                      <span className='py-0.5'>Set Price and Tax</span>
                                    </div>
                                    {openPriceDropDown[index] &&(
                                      <div className="absolute z-10 top-9 right-0 bg-brand-blue rounded-md shadow-gray-shadow1 shadow-lg flex flex-col min-w-[30vw]">
                                        <SetPrices
                                          products={products}
                                          setProducts={setProducts}
                                          productIndex={index}
                                          bands={bands}
                                          taxBands={taxBands}
                                          bandsError={bandsError}
                                          setBandsError={setBandsError}
                                          setBands={setBands}
                                          setTaxBands={setTaxBands}
                                          closePriceDropdown={()=>handleOpenDropdown(index, setOpenPriceDropDown)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/** Select components **/}
                                <div className="flex gap-1 flex-col max-w-1/6">
                                  <label className="text-sm font-thin text-text-white">
                                      ''
                                  </label>
                                  <div className={`relative border border-gray-border rounded-md p-2 text-sm text-text-white bg-brand-blue mb-1 cursor-pointer w-full shadow-md ${componentsDropDown[index]? 'pb-5':''}`}>
                                    <div 
                                      onClick={() => handleOpenDropdown(index, setComponentsDropDown)} 
                                      className="flex flex-row items-center justify-center gap-1"
                                    >
                                      <Image
                                        src={'/assets/add_white.png'}
                                        alt='add'
                                        width={16}
                                        height={16}
                                      />
                                      <span className='py-0.5'>select Components</span>
                                    </div>
                                    {componentsDropDown[index] &&(
                                      <div className="absolute z-10 top-9 right-[-50%] bg-brand-blue rounded-md shadow-gray-shadow1 shadow-lg flex flex-col w-[55vw]">
                                        <SelectComponents
                                          products={products}
                                          setProducts={setProducts}
                                          productIndex={index}
                                          materials={materials}
                                          setMaterials={setMaterials}
                                          bands={bands}
                                          showSelectComponents={showSelectComponents}
                                          setShowSelectComponents={setShowSelectComponents}
                                          closeComponentsDropdown={()=>handleOpenDropdown(index, setComponentsDropDown)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Add picture */}
                                <div className='flex flex-col justify-center items-center gap-1 relative'>
                                  <div 
                                    onClick={()=>handleOpenDropdown(index, setOpenAddPictureOverlay)} 
                                    className='cursor-pointer'
                                  >
                                    <span className={`
                                      ${product.image ? 
                                        'bg-gray-shadow8 p-5' : 
                                        'bg-gray-200 p-5'
                                      } rounded-full flex items-center justify-center`}
                                    >
                                      <Image
                                        src={product.image ? product.image.url : '/assets/shopping-bag.png'}
                                        alt={'product'}
                                        width={25}
                                        height={25}
                                      />
                                    </span>
                                    <span className='text-text-blue font-semibold text-sm'>Add picture</span>
                                  </div>
                                  {openAddPictureOverlay[index] &&
                                    <div className="absolute z-10 top-16 right-0 bg-brand-blue rounded-md shadow-gray-shadow1 shadow-lg flex flex-col">
                                      <AddPicture 
                                        product={product}
                                        setProducts={setProducts}
                                        handleClosePicture={
                                          ()=>handleOpenDropdown(index, setOpenAddPictureOverlay)
                                        }
                                        productIndex={index}
                                      />
                                    </div>
                                  }
                                </div>


                            </div>

                            {/* Add description */}
                            <div className='relative'>
                              {openAddProductDescription[index] ? (
                                <div className='absolute top-0 left-0 inset-0 z-10 rounded-lg shadow-lg w-full'>
                                  <AddDescription
                                    productIndex={index}
                                    product={product}
                                    setProducts={setProducts}
                                    handleCloseDescription={
                                      ()=>handleOpenDropdown(index, setOpenAddProductDescription)
                                    }
                                  />
                                </div>
                                ):(
                                  <span 
                                    onClick={()=>handleOpenDropdown(index, setOpenAddProductDescription)} 
                                    className='font-semibold text-sm text-brand-blue cursor-pointer hover:underline w-fit'
                                  >
                                    Add product description
                                  </span>
                                )
                              }
                            </div>
                            <hr className="my-1 border-text-gray border-1"/>
                        </div>
                    </div>
                ))
            }
        </form>

        {/* Buttons */}
        <div className='flex flex-row justify-between px-10 py-2 sticky bottom-0 bg-white'>
          <button 
            onClick={handleAddMoreProduct}
            className='flex flex-row p-2 text-brand-blue bg-blue-shadow9 gap-2 rounded-lg text-sm font-semibold items-center'
          >
            <Image
               src={`/assets/add_blue.png`}
               alt='add product'
               width={20}
               height={20}
            />
            <span className=''>Add More Product</span>
          </button>
          <div className='flex gap-2'>
            <button 
              onClick={(e) => handleCreateProduct(e)}
              className='bg-brand-blue p-2 rounded-lg text-text-white'
            >
              {products?.length>1? `Create Products`: `Create Product`}
            </button>
            <button
             onClick={handleResetForm}
             className='border border-brand-blue rounded-lg text-brand-blue py-2 px-4'
            >
              Reset
            </button>
          </div>
          
        </div>
    </div>
  )
}

export default CreateProductForm;