'use client';
import React from 'react';
import ProductManagementSidebar from '../ProductManagementSidebar';
import SubHeader from '@/components/account/admin/SubHeader';
import Header from '@/components/account/Header';
import PageDescription from '@/components/account/PageDescription';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/account/Spinner';
import ProductAvailabilityDetails from './ProductAvailabilityDetails';
import ProductComponentsPriceAndTaxDetails from './ProductComponentsPriceAndTaxDetails';
import DeleteModal from '@/components/account/DeleteModal';
import DeactivationModal from '@/components/account/DeactivationModal';
import { capitalizeFirst } from '@/utilities/stringUtils';
import {
  activateProductInAllBranchesService,
  deactivateProductInAllBranchesService,
  deleteProductsService,
  enableOrDisableProductService,
  updateProductAvailabilityInBranchesService,
} from '@/services/productsServices';
import SuccessModal from '@/components/account/SuccessModal';
import ProductDescriptionSection from './ProductDescriptionSection';
import { FaEdit, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const ViewProductDetails = ({
  pageDescription,
  productData,
  setProductData,
  branches,
}) => {
  const selectedSubMenu = {
    name: 'View All Products',
    link: '/',
  };

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEnableOrDisableModal, setOpenEnableOrDisableModal] =
    React.useState(false);
  const [enableOrDisableSuccess, setEnableOrDisableSuccess] =
    React.useState(false);
  const [enableAndDisableErrors, setEnableAndDisableErrors] = React.useState(
    []
  );
  const [enableAndDisableMessages, setEnableAndDisableMessages] =
    React.useState([]);
  const [
    openUpdateProductAvailabilityModal,
    setOpenUpdateProductAvailabilityModal,
  ] = React.useState(false);
  const [
    productAvailabilityUpdateSuccess,
    setProductAvailabilityUpdateSuccess,
  ] = React.useState(false);
  const [productAvailabilityUpdateErrors, setProductAvailabilityUpdateErrors] =
    React.useState([]);
  const [
    productAvailabilityUpdateMessages,
    setProductAvailabilityUpdateMessages,
  ] = React.useState([]);
  const [productAvailabilityAction, setProductAvailabilityAction] =
    React.useState({ type: '', text: '', count: '' });
  const [deleteMessages, setDeleteMessages] = React.useState([]);
  const [deleteErrors, setDeleteErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBranches, setSelectedBranches] = React.useState([]);
  const Router = useRouter();

  const handleDeleteProducts = async () => {
    try {
      setLoading(true);
      const response = await deleteProductsService([productData._id]);
      if (response.data) {
        const data = response.data;
        if (data.deletedProducts.length > 0) {
          setDeleteMessages([`Product deleted successfully.`]);
          setOpenDeleteModal(false);
        }
        if (data.productsNotDeleted.length > 0) {
          const collectErrorMessages = data.productsNotDeleted.map(
            (product) => product.message
          );
          const errorTypes = [...new Set(collectErrorMessages)];
          let errorProductsNotDeleted = [];
          errorTypes.forEach((errorType) => {
            const errorProduct = data.productsNotDeleted.filter(
              (product) => product.message === errorType
            );
            errorProductsNotDeleted = [
              ...errorProductsNotDeleted,
              { errorType, errorProduct },
            ];
          });
          const errorMessages = errorProductsNotDeleted.map((error) => {
            return `${error.errorType} - Products affected: ${error.errorProduct.map((product) => product.name).join(', ')}`;
          });

          setDeleteErrors(errorMessages);
        }
      }
      if (response.error) {
        setDeleteErrors(
          [response.error] || ['Error deleting product, please try again.']
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setDeleteErrors(['Error deleting products, please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableOrDisableProduct = async () => {
    const productId = [productData._id];
    const productsStatus = productData?.isDisabled ? 'inactive' : 'active';

    if (productId.length === 0) {
      return;
    }

    try {
      setLoading(true);
      let response;
      if (productsStatus === 'active') {
        // Disable product(s)
        response = await enableOrDisableProductService(productId, 'inactive');
      } else if (productsStatus === 'inactive') {
        // Enable product(s)
        response = await enableOrDisableProductService(productId, 'active');
      }

      if (response.error) {
        console.error(response.error, 'error changing user status');
        setEnableAndDisableErrors([
          response.error || 'Error with product, please try again',
        ]);
        setEnableAndDisableMessages([]);
      } else if (response.data) {
        setEnableAndDisableMessages([
          response.message || 'Product status changed successfully',
        ]);
        setEnableAndDisableErrors([]);
        // Update the product status in the local state
        setProductData((prevData) => ({
          ...prevData,
          isDisabled: !prevData.isDisabled,
        }));
        setOpenEnableOrDisableModal(false);
        setEnableOrDisableSuccess(true);
      }
    } catch (error) {
      console.error('Error enabling or disabling product:', error);
      setEnableAndDisableErrors([
        'Error enabling or disabling product, please try again',
      ]);
      setEnableAndDisableMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAllModals = (redirect) => {
    setOpenDeleteModal(false);
    setOpenEnableOrDisableModal(false);
    setDeleteErrors([]);
    setDeleteMessages([]);
    setEnableOrDisableSuccess(false);
    setEnableAndDisableErrors([]);
    setEnableAndDisableMessages([]);
    setProductAvailabilityUpdateErrors([]);
    setProductAvailabilityUpdateMessages([]);
    setProductAvailabilityUpdateSuccess(false);
    if (redirect) {
      Router.push('/pages/account/admin/product-management');
    }
  };

  const handleUpdateProductAvailability = async () => {
    try {
      setLoading(true);

      // Make API call to update product availability based on productAvailabilityAction and selected branches
      let response;

      if (productAvailabilityAction.count === 'all') {
        if (productAvailabilityAction.type === 'makeAvailable') {
          response = await activateProductInAllBranchesService(productData._id);
        } else if (productAvailabilityAction.type === 'makeUnavailable') {
          response = await deactivateProductInAllBranchesService(
            productData._id
          );
        }
      } else {
        const branchIds = selectedBranches;
        response = await updateProductAvailabilityInBranchesService(
          productData._id,
          branchIds,
          productAvailabilityAction.type
        );
      }

      if (response.error) {
        console.error(response.error, 'error updating product availability');
        setProductAvailabilityUpdateErrors([
          response.error ||
            'Error updating product availability, please try again',
        ]);
        setProductAvailabilityUpdateMessages([]);
      } else if (response.data) {
        setProductAvailabilityUpdateMessages([
          response.message || 'Product availability updated successfully',
        ]);
        setProductAvailabilityUpdateErrors([]);
        // Update the product availability status in the local state
        setProductData((prevData) => ({
          ...prevData,
          availabilityStatus:
            response.data.availabilityStatus?.map((branch) => ({
              branch: { _id: branch.branch },
              madeAvailable: branch.madeAvailable,
              status: branch.status,
            })) || [],
        }));
        setOpenUpdateProductAvailabilityModal(false);
        setProductAvailabilityUpdateSuccess(true);
      }
    } catch (error) {
      console.error('Error updating product availability:', error);
      setProductAvailabilityUpdateErrors([
        'Error updating product availability, please try again',
      ]);
      setProductAvailabilityUpdateMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const branchesWithAvailability = Array.isArray(
    productData?.availabilityStatus
  )
    ? productData.availabilityStatus.filter(
        (item) => item.madeAvailable === true
      )
    : [];

  return (
    <div className="relative bg-background-1 h-screen overflow-hidden">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'View Product Details'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute top-0 z-20">
          <ProductManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="px-5 h-full flex flex-col gap-2 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar">
            {productData && !loading ? (
              <div className=" h-full flex flex-col gap-2 min-h-[70vh] max-h-[80vh] overflow-y-auto no-scrollbar relative">
                {/* Header Section */}
                <div className="bg-text-white p-2 sticky top-0 z-10 w-full flex flex-row items-center justify-between ml-5">
                  <h3 className="flex flex-row items-center gap-4">
                    <span className="text-base font-semibold flex flex-col">
                      <span>
                        {(productData.name &&
                          productData?.name[0]?.toUpperCase() +
                            productData?.name?.slice(1)) ||
                          'Unnamed Product'}
                      </span>
                      <span className="text-xs text-text-gray py-1">
                        ID: {productData?._id}
                      </span>
                    </span>
                    <span
                      className={`text-sm ${productData?.isDisabled ? 'bg-error' : 'bg-success text-text-white'} rounded-full p-1 items-center justify-center flex`}
                    >
                      {productData?.isDisabled ? 'Inactive' : 'Active'}
                    </span>
                  </h3>

                  {/*number of active branches */}
                  <span className="text-sm text-brand-blue">
                    Available for sale in{' '}
                    {branchesWithAvailability?.length || 0}{' '}
                    {branchesWithAvailability?.length === 1
                      ? 'branch'
                      : 'branches'}
                  </span>

                  {/* Action Buttons */}
                  <ul className="flex flex-row gap-3 mx-5">
                    <button
                      onClick={() =>
                        Router.push(
                          `/pages/account/admin/product-management/edit-product?id=${productData?._id}`
                        )
                      }
                      className="border border-brand-blue text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 hover:bg-brand-blue hover:text-text-white transition"
                    >
                      <FaEdit />
                      Update
                    </button>
                    <li>
                      <button
                        onClick={() => setOpenEnableOrDisableModal(true)}
                        className={`border text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 ${productData?.isDisabled ? 'hover:bg-brand-green border-brand-green' : 'hover:bg-amber-500 border-amber-500'} hover:text-text-white transition`}
                      >
                        <FaExclamationTriangle />
                        {productData?.isDisabled ? 'Activate' : 'Deactivate'}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setOpenDeleteModal(true)}
                        className="border border-error text-text-gray p-1 rounded-lg flex flex-row items-center gap-1 hover:bg-error hover:text-text-white transition"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-row w-full px-5 gap-5">
                  {/* Product Description and Audit Section */}
                  <div className="w-1/5 gap-2 flex flex-col overflow-y-auto scrollbar-thin">
                    <ProductDescriptionSection
                      productData={productData}
                      loading={loading}
                    />
                  </div>

                  {/* Product Components, Price and Tax Details Section */}
                  <div className="w-3/5 bg-white rounded-lg shadow-lg p-2">
                    <ProductComponentsPriceAndTaxDetails
                      productData={productData}
                      setProductData={setProductData}
                      loading={loading}
                    />
                  </div>

                  {/* Product Availability Details Section */}
                  <div className="w-1/5 bg-white rounded-lg shadow-lg p-2">
                    <ProductAvailabilityDetails
                      branches={branches}
                      selectedBranches={selectedBranches}
                      setSelectedBranches={setSelectedBranches}
                      branchesWithAvailability={branchesWithAvailability}
                      loading={loading}
                      branchesAvailabilityStatus={
                        productData?.availabilityStatus || []
                      }
                      setProductAvailabilityAction={
                        setProductAvailabilityAction
                      }
                      setOpenUpdateProductAvailabilityModal={
                        setOpenUpdateProductAvailabilityModal
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Spinner />
            )}
            <div className="">
              <PageDescription pageDescription={pageDescription} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <DeleteModal
            message={`Are you sure you want to delete this product? This action cannot be undone.`}
            title={`${capitalizeFirst(productData?.name) || 'Product'}`}
            buttonStyle={`bg-error text-white hover:bg-error-hover`}
            onClose={() => handleCloseAllModals(false)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SuccessModal
            message={`Product deleted successfully.`}
            title={`Product Deleted`}
            buttonStyle={`bg-brand-blue text-text-white`}
            buttonText={`Done`}
            onClose={() => handleCloseAllModals(true)}
          />
        </div>
      )}

      {/* Enable or Disable Modal */}
      {openEnableOrDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <DeactivationModal
            message={`Are you sure you want to ${
              productData?.isDisabled ? 'activate' : 'deactivate'
            } this product? \n ${!productData?.isDisabled ? 'This would make the product unavailable for sale in the store-front across all branches.' : ''}`}
            title={
              productData?.isDisabled ? 'Disable products' : 'Enable products'
            }
            buttonStyle={`bg-brand-blue text-white hover:bg-brand-blue-hover`}
            buttonText={productData?.isDisabled ? 'Activate' : 'Deactivate'}
            onClose={() => handleCloseAllModals(false)}
            onConfirm={() => handleEnableOrDisableProduct([productData._id])}
            loading={loading}
            deactivationErrors={enableAndDisableErrors}
            deactivationMessages={enableAndDisableMessages}
          />
        </div>
      )}

      {/* Enable or disable success Modal */}
      {enableOrDisableSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SuccessModal
            message={`Product ${productData?.isDisabled ? 'deactivated' : 'activated'} successfully.`}
            title={`Product ${productData?.isDisabled ? 'Deactivated' : 'Activated'}`}
            buttonStyle={`bg-brand-blue text-text-white`}
            buttonText={`Done`}
            onClose={() => handleCloseAllModals(false)}
          />
        </div>
      )}

      {/* Update product availability modal */}
      {openUpdateProductAvailabilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <DeactivationModal
            message={`${capitalizeFirst(productAvailabilityAction.text)} in ${
              productAvailabilityAction.count
            } ${
              productAvailabilityAction.count === 1 ? 'branch' : 'branches'
            }?`}
            title={`Update Product Availability`}
            onClose={() => setOpenUpdateProductAvailabilityModal(false)}
            onConfirm={handleUpdateProductAvailability}
            buttonStyle={`bg-brand-blue text-white hover:bg-brand-blue-hover`}
            button2Style={`bg-blue-shadow6`}
            buttonText={`Confirm`}
            button2Text={`Cancel`}
            loading={loading}
            deactivationErrors={productAvailabilityUpdateErrors}
            deactivationMessages={productAvailabilityUpdateMessages}
          />
        </div>
      )}

      {/* Update product availability success Modal */}
      {productAvailabilityUpdateSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <SuccessModal
            message={`Product availability updated successfully.`}
            title={`Product Availability Updated`}
            buttonStyle={`bg-brand-blue text-text-white`}
            buttonText={`Done`}
            onClose={() => handleCloseAllModals(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ViewProductDetails;
