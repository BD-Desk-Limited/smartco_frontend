import Image from 'next/image';
import React from 'react';
import AddPicture from '../create-products/AddPicture';
import SetPrices from '../create-products/SetPrices';
import SelectComponents from '../create-products/SelectComponents';
import AddDescription from '../create-products/AddDescription';

// Single-product edit form that reuses existing create subcomponents without changing them
const EditProductForm = ({
  product,
  setProduct,
  productCategories,
  bands,
  taxBands,
  bandsError,
  setBandsError,
  materials,
  handleSubmit,
  error,
  companyDetails,
}) => {
  const [categorySearch, setCategorySearch] = React.useState('');
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [addNewCategory, setAddNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [componentsDropDown, setComponentsDropDown] = React.useState(false);
  const [openPriceDropDown, setOpenPriceDropDown] = React.useState(false);
  const [openAddPictureOverlay, setOpenAddPictureOverlay] = React.useState(false);
  const [openAddProductDescription, setOpenAddProductDescription] = React.useState(false);
  const [showSelectComponents, setShowSelectComponents] = React.useState({});

  // adapters to reuse existing child components that expect products[] + productIndex
  const products = [product];
  const setProducts = (updater) => {
    // updater could be function(prev) or array directly
    if (typeof updater === 'function') {
      const next = updater([product]);
      setProduct(next[0]);
    } else if (Array.isArray(updater)) {
      setProduct(updater[0]);
    }
  };
  const productIndex = 0;

  const handleChoseCategory = (categoryObj) => {
    setProduct(prev => ({ ...prev, category: categoryObj.name }));
    setCategorySearch('');
    setCategoryOpen(false);
    setAddNewCategory(false);
    setNewCategoryName('');
  };

  const handleEnterNewCategory = () => {
    setProduct(prev => ({ ...prev, category: newCategoryName }));
    setCategorySearch('');
    setCategoryOpen(false);
    setAddNewCategory(false);
    setNewCategoryName('');
  };

  return (
    <div className='h-full bg-white rounded-lg p-3 text-text-gray'>
      <span className='font-semibold text-sm'>Edit Product</span>

      {/* Form Fields */}
      <form className="flex flex-col my-5" onSubmit={handleSubmit}>
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full hover:bg-gray-shadow9 p-2 rounded-lg relative">

            {/* Input Fields */}
            <div className="flex flex-row gap-5 mb-2 w-full">

              {/* Product Name */}
              <div className="flex gap-1 flex-col w-1/3">
                <label className="text-sm font-thin text-text-black">Product Name</label>
                <input
                  type="text"
                  value={product.name || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product Name"
                  className="border border-gray-border rounded-md p-2 focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Product Category */}
              <div className="flex gap-1 flex-col min-w-1/5">
                <label className="text-sm font-thin text-text-black">Category</label>
                <div className="relative border border-gray-border rounded-md p-2 text-sm text-text-gray mb-1 cursor-pointer w-full">
                  <div 
                    onClick={() => setCategoryOpen(!categoryOpen)} 
                    className="flex flex-row items-center justify-between gap-2"
                  >
                    <span className='py-0.5'>{product.category || 'select a product category'}</span>
                    <Image
                      src={`${ categoryOpen? '/assets/arrow_left_dark.png':'/assets/arrow_down_dark.png'}`}
                      alt='drop down'
                      width={8}
                      height={8}
                    />
                  </div>
                  {categoryOpen && (
                    <ul className="absolute z-10 top-9 left-0 bg-white border border-gray-border rounded-md shadow-md flex flex-col min-w-40">
                      <li className='flex flex-row items-center justify-center rounded-xl bg-gray-shadow9 m-1 px-1 border border-gray-border'>
                        <Image src={`/assets/search.png`} alt='search' width={16} height={16}/>
                        <input
                          type='text'
                          value={categorySearch}
                          onChange={(e)=>setCategorySearch(e.target.value)}
                          placeholder='Search categories'
                          className='py-1 bg-transparent rounded-xl w-3/4 p-2 focus:outline-none text-sm text-text-gray focus:ring-0'
                        />
                      </li>
                      <li className='max-h-80 overflow-y-auto  scrollbar-thin my-0.5 flex flex-col'>
                        {productCategories
                          .filter(cat => cat?.name?.toLowerCase()?.includes(categorySearch?.toLowerCase() || ''))
                          .map(category => (
                            <span
                              key={category._id}
                              className="p-2 text-sm cursor-pointer hover:bg-brand-blue hover:text-white"
                              onClick={()=>handleChoseCategory(category)}
                            >
                              {category.name}
                            </span>
                          ))}
                      </li>
                      <li className='w-full text-center my-2'>
                        {addNewCategory ? (
                          <span className='flex flex-col gap-1 justify-center items-center'>
                            <input
                              type='text'
                              value={newCategoryName}
                              onChange={(e)=>setNewCategoryName(e.target.value)}
                              placeholder='enter category name'
                              className='rounded-lg p-2 mx-2 border border-gray-border focus:outline-brand-blue text-sm text-text-gray focus:ring-1 focus:ring-brand-blue'
                            />
                            <span onClick={handleEnterNewCategory} className='py-1 px-2 w-fit text-text-white rounded-md bg-brand-blue'>
                              Enter
                            </span>
                          </span>
                        ):(
                          <span 
                            onClick={()=>setAddNewCategory(true)} 
                            className='text-brand-blue p-1 rounded-md mx-1 text-center font-bold flex flex-row items-center justify-center gap-1 border border-brand-blue'
                          >
                            <Image src={`/assets/add_blue.png`} width={16} height={16} alt='add new category'/>
                            <span className='w-full'>Add new category</span>
                          </span>
                        )}
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Set price */}
              <div className="flex gap-1 flex-col w-1/7">
                <label className="text-sm font-thin text-text-white">{` `}</label>
                <div className={`relative border border-gray-border rounded-md p-2 text-sm text-text-white bg-brand-blue mb-1 cursor-pointer w-full shadow-md ${openPriceDropDown? 'pb-5':''}`}>
                  <div 
                    onClick={() => setOpenPriceDropDown(!openPriceDropDown)} 
                    className="flex flex-row items-center justify-between gap-1"
                  >
                    <Image src={'/assets/add_white.png'} alt='add' width={16} height={16} />
                    <span className='py-0.5'>Set Price and Tax</span>
                  </div>
                  {openPriceDropDown &&(
                    <div className="absolute z-10 top-9 right-0 bg-brand-blue rounded-md shadow-gray-shadow1 shadow-lg flex flex-col min-w-[35vw]">
                      <SetPrices
                        products={products}
                        setProducts={setProducts}
                        productIndex={productIndex}
                        bands={bands}
                        taxBands={taxBands}
                        bandsError={bandsError}
                        setBandsError={setBandsError}
                        companyDetails={companyDetails}
                        closePriceDropdown={()=>setOpenPriceDropDown(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Select components */}
              <div className="flex gap-1 flex-col max-w-1/6">
                <label className="text-sm font-thin text-text-white">{` `}</label>
                <div className={`relative border border-gray-border rounded-md p-2 text-sm text-text-white bg-brand-blue mb-1 cursor-pointer w-full shadow-md ${componentsDropDown? 'pb-5':''}`}>
                  <div 
                    onClick={() => setComponentsDropDown(!componentsDropDown)} 
                    className="flex flex-row items-center justify-center gap-1"
                  >
                    <Image src={'/assets/add_white.png'} alt='add' width={16} height={16} />
                    <span className='py-0.5'>select Components</span>
                  </div>
                  {componentsDropDown &&(
                    <div className="absolute z-10 top-9 right-[-50%] bg-brand-blue rounded-md shadow-gray-shadow1 shadow-lg flex flex-col w-[50vw]">
                      <SelectComponents
                        products={products}
                        setProducts={setProducts}
                        productIndex={productIndex}
                        materials={materials}
                        bands={bands}
                        showSelectComponents={showSelectComponents}
                        setShowSelectComponents={setShowSelectComponents}
                        closeComponentsDropdown={()=>setComponentsDropDown(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Add picture */}
              <div className='flex flex-col justify-center items-center gap-1 relative'>
                <div onClick={()=>setOpenAddPictureOverlay(!openAddPictureOverlay)} className='cursor-pointer'>
                  <span className={`${product.image ? 'bg-gray-shadow8 p-5' : 'bg-gray-200 p-5'} rounded-full flex items-center justify-center`}>
                    <Image src={product.image ? product.image.url : '/assets/shopping-bag.png'} alt={'product'} width={25} height={25} />
                  </span>
                  <span className='text-text-blue font-semibold text-sm'>Add picture</span>
                </div>
                {openAddPictureOverlay &&
                  <div className="absolute z-10 top-16 right-0 bg-brand-blue rounded-md shadow-gray-shadow1 shadow-lg flex flex-col">
                    <AddPicture 
                      product={product}
                      setProducts={setProducts}
                      handleClosePicture={() => setOpenAddPictureOverlay(false)}
                      productIndex={productIndex}
                    />
                  </div>
                }
              </div>

            </div>

            {/* Add description */}
            <div className='relative'>
              {openAddProductDescription ? (
                <div className='absolute top-0 left-0 inset-0 z-10 rounded-lg shadow-lg w-full'>
                  <AddDescription
                    productIndex={productIndex}
                    product={product}
                    setProducts={setProducts}
                    handleCloseDescription={() => setOpenAddProductDescription(false)}
                  />
                </div>
              ):(
                <span onClick={()=>setOpenAddProductDescription(true)} className='font-semibold text-sm text-brand-blue cursor-pointer hover:underline w-fit'>
                  Add product description
                </span>
              )}
            </div>
            <hr className="my-1 border-text-gray border-1"/>
          </div>
        </div>
      </form>

      {/* Buttons and Errors */}
      <div className='flex flex-col py-3 sticky bottom-0 bg-white'>
        {error && error.length > 0 && (
          <div className='bg-error bg-opacity-20 border border-error text-error p-3 rounded-lg mb-3'>
            {error.map((errMsg, idx) => (
              <p key={idx} className='text-sm'>{errMsg}</p>
            ))}
          </div>
        )}
        <div className='flex flex-row justify-end px-10'>
          <button onClick={handleSubmit} className='bg-brand-blue p-2 rounded-lg text-text-white'>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
