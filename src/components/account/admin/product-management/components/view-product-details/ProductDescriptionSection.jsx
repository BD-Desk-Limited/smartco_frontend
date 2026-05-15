import Spinner from '@/components/account/Spinner';
import Image from 'next/image';
import React from 'react';

const ProductDescriptionSection = ({ productData, loading }) => {
  return (
    <>
      {!loading ? (
        <>
          <div className="bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2">
            <Image
              src={
                productData?.imageURL
                  ? productData?.imageURL
                  : `/assets/shopping.png`
              }
              alt={productData?.name || 'Product Image'}
              className="w-40 h-40 object-cover rounded-lg "
              width={100}
              height={100}
            />
            <span className="flex flex-col">
              <span className="text-text-gray text-sm">Category</span>
              <span className="font-semibold text-brand-blue">
                {productData?.category?.name || 'Uncategorized'}
              </span>
            </span>
          </div>

          {/* Description Section */}
          <div className="bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2">
            <h4 className="font-semibold text-brand-blue mb-2">Description</h4>
            <p className="text-text-gray text-sm h-24 overflow-y-auto no-scrollbar">
              {productData?.description ||
                'No description available for this product.'}
            </p>
          </div>

          {/* Audit Section */}
          <div className="bg-white shadow-lg p-2 rounded-lg flex flex-col gap-2 h-24 overflow-y-auto no-scrollbar">
            <p className="text-text-gray text-sm">
              Created at:{' '}
              {productData?.createdAt
                ? new Date(productData?.createdAt).toLocaleString()
                : 'N/A'}
            </p>
            <p className="text-text-gray text-sm">
              Created by: {productData?.createdBy?.fullName || 'N/A'}
            </p>
            <p className="text-text-gray text-sm">
              Last updated:{' '}
              {productData?.updatedAt
                ? new Date(productData?.updatedAt).toLocaleString()
                : 'N/A'}
            </p>
            <p className="text-text-gray text-sm">
              Updated by: {productData?.updatedBy?.fullName || 'N/A'}
            </p>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default ProductDescriptionSection;
