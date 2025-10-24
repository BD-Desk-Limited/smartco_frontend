import React from 'react'
import ProductManagementSidebar from '../ProductManagementSidebar';
import SubHeader from '@/components/account/SubHeader';
import Header from '@/components/account/Header';
import PageDescription from '@/components/account/PageDescription';
import Image from 'next/image';
import Spinner from '@/components/account/Spinner';
import ProductAvailabilityDetails from './ProductAvailabilityDetails';
import ProductComponentsPriceAndTaxDetails from './ProductComponentsPriceAndTaxDetails';
import { useCompanyData } from '@/contexts/companyDataContext';

const ViewProductDetails = ({pageDescription, productData, setProductData, branches, setBranches}) => {

  const selectedSubMenu = {
    name: 'View All Products',
    link: '/',
  };

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const { companyData } = useCompanyData();
  console.log('Product Data:', productData);
  console.log('Company Data:', companyData);

  return (
    <div className='relative bg-background-1'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'View Product Details'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute top-0 z-10">
          <ProductManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
          <div className="p-5 h-full flex flex-col gap-5 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar">
            {productData? 
            <div className="p-5 h-full flex flex-col gap-2 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar relative">
              {/* Header Section */}
              <div className='bg-text-white p-2 sticky top-0 z-10 w-full flex flex-row items-center justify-between mb-5'>
                <h3 className='flex flex-row items-center gap-4'>
                  <span className='text-lg font-semibold flex flex-col'>
                    <span>
                      {productData.name && (productData?.name[0]?.toUpperCase() + productData?.name?.slice(1)) || 'Unnamed Product'}
                    </span>
                    <span className='text-xs text-text-gray'>ID: {productData?._id}</span>
                  </span>
                  <span className={`text-sm ${productData?.disabled ? 'bg-error' : 'bg-success text-text-white'} rounded-full p-1 items-center justify-center flex`}>
                    {productData?.disabled ? 'Inactive' : 'Active'}
                  </span>
                </h3>

                {/*number of active branches */}
                <span className='text-sm text-brand-blue'>
                  Available for sale in {
                    productData?.availabilityStatus?.length || 0
                  } {productData.availabilityStatus?.length === 1 ? 'branch' : 'branches'}
                </span>

                {/* Action Buttons */}
                <ul className='flex flex-row gap-3 list-none'>
                  <li>
                    <button className='border border-brand-blue text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 hover:bg-brand-blue hover:text-text-white transition'>  
                      <Image src={`/assets/edit.png`} alt={`Update`} width={16} height={16} />
                      Update
                    </button>
                  </li>
                  <li>
                    <button className='border border-amber-500 text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 hover:bg-amber-500 hover:text-text-white transition'>  
                      <Image src={`/assets/warning.png`} alt={`Update`} width={16} height={16} />
                      Disable
                    </button>
                  </li>
                  <li>
                    <button className='border border-error text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 hover:bg-error hover:text-text-white transition'>  
                      <Image src={`/assets/delete.png`} alt={`Update`} width={16} height={16} />
                      Delete
                    </button>
                  </li>
                </ul>
                
              </div>

              <div className='flex flex-row w-full px-5 gap-5'>
                <div className='w-1/5 gap-5 flex flex-col'>
                  <div className='bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2'>
                    <Image
                      src={productData?.imageURL ? productData?.imageURL : `/assets/shopping.png`}
                      alt={productData?.name || 'Product Image'}
                      className='w-40 h-40 object-cover rounded-lg '
                      width={100}
                      height={100}
                    />
                    <span className='flex flex-col'>
                      <span className='text-text-gray text-sm'>
                        Category
                      </span> 
                      <span className='font-semibold text-brand-blue'>
                        {productData?.category?.name || 'Uncategorized'}
                      </span>
                    </span>
                  </div>

                  {/* Description Section */}
                  <div className='bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2'>
                    <h4 className='font-semibold text-brand-blue mb-2'>Description</h4>
                    <p className='text-text-gray text-sm h-24 overflow-y-auto no-scrollbar'>
                      {productData?.description || 'No description available for this product.'}
                    </p>
                  </div>

                  {/* Audit Section */}
                  <div className='bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2 h-24 overflow-y-auto no-scrollbar'>
                    <p className='text-text-gray text-sm'>
                      Created at: {productData?.createdAt ? new Date(productData?.createdAt).toLocaleString() : 'N/A'}
                    </p>
                    <p className='text-text-gray text-sm'>
                      Created by: {productData?.createdBy?.fullName || 'N/A'}
                    </p>
                    <p className='text-text-gray text-sm'>
                      Last updated: {productData?.updatedAt ? new Date(productData?.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                    <p className='text-text-gray text-sm'>
                      Updated by: {productData?.updatedBy?.fullName || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className='w-3/5 bg-white rounded-lg shadow-lg p-2'>
                  <ProductComponentsPriceAndTaxDetails 
                    productData={productData}
                    setProductData={setProductData}
                  />
                </div>

                {/* Product Availability Details Section */}
                <div className='w-1/5 bg-white rounded-lg shadow-lg p-2'>
                  <ProductAvailabilityDetails 
                    branches={branches} 
                    setBranches={setBranches}
                    branchesProductIsAvailableIn={productData?.availabilityStatus || []}
                    setProductData={setProductData}
                  />
                </div>
              </div>
            
            </div>: 
            <Spinner />
            }
            <div className=''>
              <PageDescription pageDescription={pageDescription}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProductDetails;