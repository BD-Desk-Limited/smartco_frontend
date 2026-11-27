'use client';
import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import CreateProducts from './components/create-products/CreateProducts';

const CreateProductPage = () => {

  const pageDescription =
    'The Create Product page allows you to add new finished and packaged items by selecting component materials and products. Here, you can enter product details such as name, category, price, and stock status. Once created, products will appear in the store front sales display and can be managed from the Product Management page. Use this interface to efficiently organize and expand your product offerings.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Products_Management'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full overflow-hidden ">
      <div className="w-full h-full overflow-y-auto ">
        <CreateProducts pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CreateProductPage;
