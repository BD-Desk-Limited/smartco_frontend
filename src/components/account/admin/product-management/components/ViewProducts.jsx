import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import Image from 'next/image';
import Link from 'next/link';
import PageDescription from '@/components/account/PageDescription';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext'; 
import ProductManagementSidebar from './ProductManagementSidebar';
import Spinner from '@/components/account/Spinner';
import DeleteModal from '@/components/account/DeleteModal';
import ExportContent from '@/components/account/ExportContent';
import SuccessModal from '@/components/account/SuccessModal';
import DeactivationModal from '@/components/account/DeactivationModal';
import { deleteProductsService, enableOrDisableProductService } from '@/services/productsServices';
import { getAllProductsByCompanyIdService } from '@/services/productsServices';

const ViewProducts = ({pageDescription}) => {

    const selectedSubMenu = {
      name: 'View All Products',
      link: '/',
    };
    
    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [selectedProduct, setSelectedProduct] = React.useState([]);
    const [allProducts, setAllProducts] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [allCategories, setAllCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openEnableOrDisableModal, setOpenEnableOrDisableModal] = React.useState(false);
    const [enableAndDisableErrors, setEnableAndDisableErrors] = React.useState([]);
    const [enableAndDisableMessages, setEnableAndDisableMessages] = React.useState([]);
    const [productsStatus, setProductsStatus] = React.useState('');
    const [exportContent, setExportContent] = React.useState(false);
    const [enableOrDisableSuccess, setEnableOrDisableSuccess] = React.useState(false);
    const [deleteMessages, setDeleteMessages] = React.useState([]);
    const [deleteErrors, setDeleteErrors] = React.useState([]);

    const Router = useRouter();

    // Get all products, update total pages and reset current page
    React.useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await getAllProductsByCompanyIdService();
          if (response.error) {
            console.error('Error fetching products:', response.error);
          } else if (response.data) {
            setAllProducts(response.data);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        } 
      };
      fetchProducts();
    }, []);

    // Get all unique categories from products
    React.useEffect(() => {
        if (allProducts.length > 0) {
          const categories = allProducts.map(product => product.category);
          const uniqueCategoriesObj = {};
          categories.forEach(cat => {
              if (cat && cat._id) {
                  uniqueCategoriesObj[cat._id] = cat;
              }
          });
          const uniqueCategories = Object.values(uniqueCategoriesObj);
          setAllCategories(uniqueCategories);
          setSelectedCategory(''); // Reset selected category when products change
        }

    }, [allProducts]);

    // Filter products based on search input and selected category
    React.useEffect(() => {
        const filtered = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                                  product.category.name.toLowerCase().includes(searchInput.toLowerCase());
            const matchesCategory = selectedCategory ? product.category._id === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
        setFilteredProducts(filtered);
    }, [searchInput, selectedCategory, allProducts]);

    const handleResetFilters = () => {
        setSearchInput('');
        setSelectedCategory('');
        setSelectedProduct([]);
    };

    const handleOpenDeleteModal = (e, productId) => {
      e.stopPropagation();
      setOpenDeleteModal(true);
      setSelectedProduct(productId);
    };

    const handleCloseDeleteModal = () => {
      setOpenDeleteModal(false);
      setDeleteErrors([]);
      setDeleteMessages([]);
    };

  const handleOpenEnableOrDisableModal = (e, productId) => {
    e.stopPropagation();

    setEnableAndDisableMessages([]); //Reset messages
    setEnableAndDisableErrors([]);   //Reset errors

    // Get the first product to compare status
    const firstProduct = allProducts.find(p => p._id === productId[0]);
    if (!firstProduct) {
      setEnableAndDisableErrors(['Product not found.']);
      setOpenEnableOrDisableModal(true);
      return;
    }

    // Check if the status of all products are the same
    const allSameStatus = productId.every(id => {
      const product = allProducts.find(p => p._id === id);
      return product && product.isDisabled === firstProduct.isDisabled;
    });

    if (allSameStatus) {
      setSelectedProduct(productId);
      setProductsStatus(firstProduct.isDisabled ? 'inactive' : 'active');
      setEnableAndDisableErrors([]);
    } else {
      setEnableAndDisableErrors(['Please select products with the same status to enable or disable.']);
    }

    setOpenEnableOrDisableModal(true);
  };


  const handleEnableOrDisableProduct = async(productId) => {
    
    setEnableAndDisableErrors([]);
    if (productId.length === 0) {
      setEnableAndDisableErrors(['Please select at least one product to enable or disable.']);
      setLoading(false);
      return;
    }

    try{
      setLoading(true);
      let response;
      if(productsStatus === 'active'){
        // Disable product(s)
        response = await enableOrDisableProductService(productId, 'inactive');
      }else if(productsStatus === 'inactive'){
        // Enable product(s)
        response = await enableOrDisableProductService(productId, 'active');
      }

      if (response.error) {
            console.error(response.error, 'error changing user status');
            setEnableAndDisableErrors([response.error]);
            setEnableAndDisableMessages([]);
        }else if (response.data) {
            setEnableAndDisableMessages([response.message]);
            setEnableAndDisableErrors([]);
            // Update the product status in the allProducts state
            const updatedProducts = allProducts.map(product => {
                if (productId.includes(product._id)) {
                    return { ...product, isDisabled: productsStatus === 'active' ? true : false };
                }
                return product;
            });
            setAllProducts(updatedProducts);
            setOpenEnableOrDisableModal(false);
            setEnableOrDisableSuccess(true);
            setSelectedProduct([]);
        }
    }catch (error) {
      console.error('Error enabling or disabling product:', error);
      setEnableAndDisableErrors(['Error enabling or disabling product, please try again']);
      setEnableAndDisableMessages([]);
    }finally {
      setLoading(false);
    }
  };

  const handleDeleteProducts = async() => {
      try{
          setLoading(true);
          const response = await deleteProductsService(selectedProduct);
          if(response.data){
              const data = response.data;
              if(data.deletedProducts.length>0){
                  const deletedProductsId = data.deletedProducts.map(product => product._id)
                  setDeleteMessages([`${data.deletedProducts.length} products deleted successfully.`]);
                  setAllProducts(allProducts.filter(product => !deletedProductsId.includes(product._id)));
                  setSelectedProduct([]);
                  setDeleteErrors([]);
                  setOpenDeleteModal(false);
              }
              if(data.productsNotDeleted.length>0){
                  const productsNotDeletedIds = data.productsNotDeleted.map(product => product.product_id);
                  const collectErrorMessages = data.productsNotDeleted.map(product => product.message)
                  const errorTypes = [...new Set(collectErrorMessages)];
                  let errorProductsNotDeleted = []
                  errorTypes.forEach((errorType) => {
                      const errorProduct = data.productsNotDeleted.filter(product => product.message === errorType);
                      errorProductsNotDeleted =  [...errorProductsNotDeleted, {errorType, errorProduct}];
                  })
                  const errorMessages = errorProductsNotDeleted.map(error => {
                      return `${error.errorType} - Products affected: ${error.errorProduct.map(product => product.name).join(', ')}`;
                  });
                  
                  setDeleteErrors(errorMessages);
                  setSelectedProduct(productsNotDeletedIds);
              }
          };
          if(response.error){
              setDeleteErrors([response.error]||['Error deleting products, please try again.']);
          };
      }catch(error){
          console.error('Error:', error);
          setDeleteErrors(['Error deleting products, please try again.']);
      }finally{
          setLoading(false);
      };
  };


  const handleSelectProduct = (productId) => {
    if (selectedProduct.includes(productId)) {
        setSelectedProduct(selectedProduct.filter(id => id !== productId));
    } else {
        setSelectedProduct([...selectedProduct, productId]);
    }
  };

  const handleCloseAllModals = () => {
    setOpenDeleteModal(false);
    setExportContent(false);
    setDeleteMessages([]);
    setSelectedProduct([]);
    setOpenEnableOrDisableModal(false);
    setEnableOrDisableSuccess(false);
    setEnableAndDisableErrors([]);
    setDeleteErrors([]);
    setProductsStatus('');
  };

  const getSelectedCategoryNameById = (categoryId) => {
    const category = allCategories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };


  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'Product Management'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <ProductManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">

            {/* search bar and filters */}
            <div className='flex flex-row gap-5 w-full justify-between items-center'>
              <div className='h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full'>
                  <Image
                      src="/assets/search.png"
                      alt="search"
                      width={15}
                      height={15}
                  />
                  <input
                      type="text"
                      placeholder="Search product name or category ..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="focus:outline-none ml-2 w-full"
                  />
              </div>
              <div className="flex flex-row gap-2 text-sm min-w-fit text-text-gray">
                <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                  <Image
                    src="/assets/filter.png"
                    alt="sort"
                    width={15}
                    height={15}
                  />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="focus:outline-none cursor-pointer"
                  >
                    <option value={''}>All Categories</option>
                    {allCategories&& allCategories.length > 0 && 
                        allCategories?.map((category) => (
                            <option key={category._id} value={category._id} className=''>
                                {category.name}
                            </option>
                        ))}
                  </select>
                </div>
                <button 
                    onClick={handleResetFilters}
                    className='h-8 px-1 border border-gray-border hover:bg-gray-shadow9 rounded-md flex flex-row items-center text-text-black'
                >
                    {`All Products - ${allProducts.length}`}
                </button>
                <button>
                  <Link href='/pages/account/admin/product-management/create-new-product' className='flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1'>
                      <Image
                          src="/assets/add.png"
                          alt="add"
                          width={15}
                          height={15}
                      />
                      <span className=''>create new product</span>
                  </Link>
                </button>
                <button 
                  className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1' 
                  onClick={() => setExportContent(true)}
                >
                  <Image
                    src={'/assets/export.png'}
                    alt="export"
                    width={15}
                    height={15}
                  />
                  <span className=''>Export</span>
                </button>
              </div>
            </div>



            {/* Table */}
            {loading? (<Spinner />):(
                <div className='overflow-x-auto w-full h-full min-h-[50vh] max-h-[60vh] overflow-y-auto scrollbar-thin relative'>
                  <table className='w-full table-auto relative'>
                    <thead className='bg-background-1 sticky top-[-1px] z-10'>
                      <tr className='text-left text-text-gray text-sm font-medium border border-gray-border'>
                        <th className='px-2 py-2 border border-gray-border text-center'>Product Name</th>
                        <th className='px-2 py-2 border border-gray-border text-center'>Product I D</th>
                        <th className='px-2 py-2 border border-gray-border text-center'>Category</th>
                        <th className='px-2 py-2 border border-gray-border text-center'>Availability</th>
                        <th className='px-2 py-2 border border-gray-border text-center'>Actions</th>
                      </tr>
                    </thead>
                    <tbody className='text-sm text-text-gray min-h-[40vh] w-full'>
                        {filteredProducts?.length > 0 ? (
                            filteredProducts?.map((product) => (
                              <tr 
                                key={product._id} 
                                className={`border-b border-gray-border hover:bg-gray-shadow10 hover:text-text-black cursor-pointer items-center w-full`}
                                onClick={() => Router.push(`/pages/account/admin/product-management/product-details?id=${product._id}`)}
                              >
                                <td className={`px-2 py-2 text-left flex items-center gap-2`}>
                                  <input 
                                    type="checkbox"
                                    value={product._id}
                                    checked={selectedProduct.includes(product._id)}
                                    onClick={(e) => e.stopPropagation()} // Stop event propagation
                                    onChange={(e) => {
                                      e.stopPropagation(); // Stop event propagation
                                      handleSelectProduct(e.target.value);
                                    }}
                                    className='cursor-pointer mr-5'
                                  />

                                  <Image
                                    src={product?.imageURL || '/assets/shopping-bag.png'}
                                    alt={product?.name || 'Product Image'}
                                    width={30}
                                    height={30}
                                    className='object-cover'
                                  />
                                  <span className={`px-2 py-2 text-center font-semibold`}>{product?.name || '-'}</span>
                                </td>
                                <td className={`px-2 py-2 text-center w-1/6`}>{product?._id || '-'}</td>
                                <td className={`px-2 py-2 text-center w-1/6`}>{product?.category?.name || '-'}</td>
                                <td className={`px-2 py-2 text-center w-1/6`}>Available in <span className='font-semibold'>{product?.availability || '-'}</span> {product?.availability > 1 ? 'branches' : 'branch'}</td>

                                {/* Actions */}
                                <td className={`px-2 py-2 text-center w-1/6`}>
                                    <span className='flex flex-row items-center gap-2 justify-around'>
                                      <button>
                                          <Image
                                              src="/assets/edit.png"
                                              alt="edit"
                                              width={15}
                                              height={15}
                                              className='cursor-pointer'
                                              title='Edit Product'
                                              onClick={(e) => {
                                                  e.stopPropagation(); // Stop event propagation
                                                  Router.push(`/pages/account/admin/product-management/edit-product?id=${product._id}`);
                                                }
                                              }
                                          />
                                      </button>
                                      <button 
                                        className=''
                                      >
                                        <Image
                                          src= {product.isDisabled !== true ? "/assets/switch_active.png" : "/assets/switch_inactive.png"}
                                          alt="delete"
                                          width={20}
                                          height={20}
                                          title={product.isDisabled ? 'Enable Product' : 'Disable Product'}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenEnableOrDisableModal(e, [product._id])
                                          }}
                                          className='cursor-pointer'
                                        />
                                      </button>
                                      <button 
                                        className=''
                                      >
                                        <Image
                                          src="/assets/delete.png"
                                          alt="delete"
                                          width={15}
                                          height={15}
                                          title='Delete Product'
                                          onClick={(e) => handleOpenDeleteModal(e, [product._id])}
                                          className='cursor-pointer'
                                        />
                                      </button>
                                    </span>
                                </td>
                              </tr>
                            ))
                        ) : (
                            <tr>
                              <td colSpan={6} className='text-center py-32 text-lg'>No products found</td>
                            </tr>
                        )}
                    </tbody>
                  </table>

                  {/* Selected products indicator */}
                  {selectedProduct.length > 0 && (
                    <div className='flex justify-end mt-4 sticky bottom-0 right-5 gap-5'>
                      <div className='bg-brand-green text-sm text-text-white p-2 rounded-md flex items-center gap-2'>
                        <span>{selectedProduct.length} SELECTED</span>
                        <button 
                          onClick={(e) => handleOpenEnableOrDisableModal(e, selectedProduct)}
                          className='text-brand-green px-2 py-1 rounded text-sm hover:scale-105'
                        >
                          <Image
                              src={productsStatus === 'active' ? "/assets/switch_active.png" : "/assets/switch_inactive.png"}
                              alt="enable or disable"
                              width={25}
                              height={25}
                              className='cursor-pointer'
                              title={productsStatus === 'active' ? 'Disable selected Products' : 'Enable selected Products'}
                          />
                        </button>
                        <button 
                          onClick={(e) => handleOpenDeleteModal(e, selectedProduct)}
                          className='text-brand-green px-2 py-1 rounded text-sm hover:scale-105'
                        >
                          <Image
                              src="/assets/delete-white.png"
                              alt="delete"
                              width={15}
                              height={15}
                              className='cursor-pointer'
                              title='Delete selected Products'
                          />
                        </button>
                      </div>

                      <button 
                          onClick={() => setSelectedProduct([])}
                          className='text-white bg-gray-shadow1 px-2 py-1 rounded text-sm hover:bg-gray-shadow3'
                        >
                          clear selection
                        </button>
                    </div>
                  )}
                </div>
            )}

        </div>
        <div className=''><PageDescription pageDescription={pageDescription}/></div>
      </div>
    </div>

    {/* Delete Confirmation Modal */}
    {openDeleteModal && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <DeleteModal
          message={`Are you sure you want to delete the selected ${selectedProduct.length>1? 'products?':'product?'} This action cannot be undone.`}
          title={selectedProduct.length>1? 'Delete Products':'Delete Product'}
          buttonStyle={`bg-error text-white hover:bg-error-hover`}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteProducts}
          button2Style={`bg-brand-blue text-white`}
          deleteErrors={deleteErrors}
          deleteMessages={deleteMessages}
          loading={loading}
        />
      </div>
    )}

    {/* Delete success Modal */}
    {deleteMessages.length > 0 && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <SuccessModal
          message={`Product deleted successfully.`}
          title={`Product Deleted`}
          buttonStyle={`bg-brand-blue text-text-white`}
          buttonText={`Done`}
          onClose={handleCloseAllModals}
        />
      </div>
    )}

    {/* Enable or Disable Modal */}
    {openEnableOrDisableModal && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <DeactivationModal
          message={
            `Are you sure you want to ${
                productsStatus === 'active'? 'deactivate':'activate'
            } the selected ${
                selectedProduct.length>1? 'products?':'product?'
            } ${productsStatus === 'active' ? (`This would make the ${
                selectedProduct.length>1? 'products':'product'
            } unavailable for sale in the store-front `):''}.`
          }
          title={
          selectedProduct.length>1? (
            productsStatus === 'active'? 'Disable products':'Enable products'
          ):(
             productsStatus === 'inactive' ? 'Enable product':'Disable product'
          )
          }
          buttonStyle={`bg-brand-blue text-white hover:bg-brand-blue-hover`}
          buttonText={productsStatus === 'active' ? 'Disable' : 'Enable'}
          onClose={handleCloseAllModals}
          onConfirm={(e)=>handleEnableOrDisableProduct(selectedProduct)}
          loading={loading}
          deactivationErrors={enableAndDisableErrors}
          deactivationMessages={enableAndDisableMessages}
        />
      </div>
    )}

    {/* Enable or disable success Modal */}
    {enableOrDisableSuccess && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
        <SuccessModal
          message={`Product ${productsStatus === 'active' ? 'disabled' : 'enabled'} successfully.`}
          title={`Product ${productsStatus === 'active' ? 'Disabled' : 'Enabled'}`}
          buttonStyle={`bg-brand-blue text-text-white`}
          buttonText={`Done`}
          onClose={handleCloseAllModals}
        />
      </div>
    )}

    {/* Export Content Modal */}
    {exportContent && filteredProducts.length > 0 &&
      <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
        <ExportContent
            metadata={{
                Date : [new Date().toLocaleDateString()],
                Time: [new Date().toLocaleTimeString()],
                category: selectedCategory? [getSelectedCategoryNameById(selectedCategory)]: ["All"],
            }}
            data={filteredProducts.map((product, index )=> {
                return {
                  "S/No": index+1,
                  "Name": product.name, 
                  "Product ID": product._id,
                  "Availability":  `Available in ${product.availability} ${product.availability > 1 ? 'branches' : 'branch'}`,
                  "Category": product.category?.name, 
                }
            })}
            onClose={() => setExportContent(false)}
            title={'Export Products'}
        />
      </div>
    }
  </div>
  )
}

export default ViewProducts;