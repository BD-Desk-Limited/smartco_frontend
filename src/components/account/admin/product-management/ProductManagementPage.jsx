'use client';
import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import ViewProducts from './components/ViewProducts';

const ProductManagementPage = () => {

  const pageDescription =
    'The Product Management page allows you to view all products. Products are finished and packaged items sold over the counter. They are typically displayed in the sales catalog but not in the inventory list. The inventory rather captures raw materials and components that are used to create these finished products. This interface provides a comprehensive overview of your products, enabling efficient updates and organization. Click on any product to view or edit its information, including name, category, price, and stock status. Use the search and filter tools to quickly locate specific products or categories.';

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
        <ViewProducts pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default ProductManagementPage;
