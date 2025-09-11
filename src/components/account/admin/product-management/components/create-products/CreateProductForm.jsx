import Image from 'next/image';
import React from 'react'
import AddPicture from './AddPicture';
import SetPrices from './SetPrices';
import SelectComponents from './SelectComponents';
import AddDescription from './AddDescription';

const CreateProductForm = ({products, setProducts, productCategories, setSelectedProduct, selectedProduct}) => {

    const [categorySearch, setCategorySearch] = React.useState('');
    const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
    const [addNewCategory, setAddNewCategory] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [componentsDropDown, setComponentsDropDown] = React.useState(false);
    const [setPriceDropDown, setSetPriceDropDown] = React.useState(false);
    const [openAddPictureOverlay, setOpenAddPictureOverlay] = React.useState(false);
    const [openAddProductDescription, setOpenAddProductDescription] = React.useState(false);

    const handleChoseCategory = (productIndex, categoryObj) => {
      setProducts(prev =>
        prev.map((p, i) =>
          i === productIndex ? { ...p, category: categoryObj.name } : p
        )
      );
      setCategorySearch('');
      setCategoryDropdownOpen(false);
      setAddNewCategory(false);
      setNewCategoryName('');
    };

    const handleEnterNewCategory = (productIndex) => {
      setProducts(prev =>
        prev.map((p, i) =>
          i === productIndex ? { ...p, category: newCategoryName } : p
        )
      );
      setCategorySearch('');
      setCategoryDropdownOpen(false);
      setAddNewCategory(false);
      setNewCategoryName('');
    };

    console.log('Product-1:', products[0])
  return (
    <div className='h-full bg-white rounded-lg p-3 text-text-gray'>
        <span className='font-semibold text-sm'>Create New Product</span>

        {/* Form Fields */}
        <form className="flex flex-col my-5">
            { products.length>0 &&
                products.map((product, index) => (
                    <div className="flex flex-row w-full" key={index}>
                        {/* each product form */}
                        <div 
                          className="flex flex-col w-full hover:bg-background-1 p-2 rounded-lg"
                          onClick={()=>setSelectedProduct(index)}
                        >
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
                                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)} 
                                          className="flex flex-row items-center justify-between gap-2"
                                        >
                                            <span className='py-0.5'>{product.category ||'select a product category'}</span>
                                            <Image
                                              src={`${ categoryDropdownOpen? '/assets/arrow_left_dark.png':'/assets/arrow_down_dark.png'}`}
                                              alt='drop down'
                                              width={8}
                                              height={8}
                                            />
                                        </div>
                                        {categoryDropdownOpen && (
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
                                                    value={categorySearch}
                                                    onChange={(e)=>setCategorySearch(e.target.value)}
                                                    placeholder='Search categories'
                                                    className='py-1 bg-transparent rounded-xl w-3/4 p-2 focus:outline-none text-sm text-text-gray focus:ring-0'
                                                />
                                            </li>
                                            <li className='max-h-80 overflow-y-auto  scrollbar-thin my-0.5 flex flex-col'>
                                              {productCategories
                                                .filter(cat =>
                                                  cat.name.toLowerCase().includes(categorySearch.toLowerCase() || '')
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
                                              {addNewCategory? (
                                                <span className='flex flex-col gap-1 justify-center items-center'>
                                                  <input
                                                    type='text'
                                                    value={newCategoryName}
                                                    onChange={(e)=>setNewCategoryName(e.target.value)}
                                                    placeholder='enter category name'
                                                    className='rounded-lg p-2 mx-2 border border-gray-border focus:outline-brand-blue text-sm text-text-gray focus:ring-1 focus:ring-brand-blue'
                                                  />
                                                  <span onClick={()=>handleEnterNewCategory(index)} className='py-1 px-2 w-fit text-text-white rounded-md bg-brand-blue'>
                                                    Enter
                                                  </span>
                                                </span>
                                              ):(
                                                <span 
                                                  onClick={()=>setAddNewCategory(true)} 
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

                                {/** Select components **/}
                                <div className="flex gap-1 flex-col max-w-1/6">
                                  <label className="text-sm font-thin text-text-white">
                                      ''
                                  </label>
                                  <div className="relative border border-gray-border rounded-md p-2 text-sm text-text-white bg-brand-blue mb-1 cursor-pointer w-full shadow-md">
                                    <div 
                                      onClick={() => setComponentsDropDown(!componentsDropDown)} 
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
                                    {componentsDropDown&&(
                                      <div className="absolute z-10 top-9 left-0 bg-brand-blue border border-gray-border rounded-md shadow-md flex flex-col min-w-40">
                                        <SelectComponents/>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/** Set price **/}
                                <div className="flex gap-1 flex-col w-1/7">
                                  <label className="text-sm font-thin text-text-white">
                                      ''
                                  </label>
                                  <div className="relative border border-gray-border rounded-md p-2 text-sm text-text-white bg-brand-blue mb-1 cursor-pointer w-full shadow-md">
                                    <div 
                                      onClick={() => setSetPriceDropDown(!setPriceDropDown)} 
                                      className="flex flex-row items-center justify-between gap-1"
                                    >
                                      <Image
                                        src={'/assets/add_white.png'}
                                        alt='add'
                                        width={16}
                                        height={16}
                                      />
                                      <span className='py-0.5'>Set Price</span>
                                    </div>
                                    {setPriceDropDown&&(
                                      <div className="absolute z-10 top-9 left-0 bg-brand-blue border border-gray-border rounded-md shadow-md flex flex-col min-w-40">
                                        <SetPrices/>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Add picture */}
                                <div className='flex flex-col justify-center items-center gap-1 relative'>
                                  {openAddPictureOverlay ? (
                                    <div className='absolute top-0 left-0'>
                                      <AddPicture />
                                    </div>
                                  ):(
                                    <div onClick={()=>setOpenAddPictureOverlay(true)} className='cursor-pointer'>
                                      <span className='bg-gray-shadow8 p-5 rounded-full flex items-center justify-center'>
                                        <Image
                                          src={'/assets/shopping-bag.png'}
                                          alt={'product'}
                                          width={25}
                                          height={25}
                                        />
                                      </span>
                                      <span className='text-text-blue font-semibold text-sm'>Add picture</span>
                                    </div>
                                  )}
                                </div>


                            </div>

                            {/* Add description */}
                            <div className='relative'>
                              {openAddProductDescription ? (
                                <div className='absolute top-0 left-0'>
                                  <AddDescription />
                                </div>
                                ):(
                                  <span 
                                    onClick={()=>setOpenAddProductDescription(true)} 
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
    </div>
  )
}

export default CreateProductForm;