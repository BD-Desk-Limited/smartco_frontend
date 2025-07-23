'use client';
import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import ViewProducts from './components/ViewProducts';

const ProductManagementPage = () => {

    const [selectedMenu, setSelectedMenu] = React.useState({
      name: 'Products',
      icon: '/assets/product.png',
      iconActive: '/assets/product_active.png',
      link: '/product-management',
      title: 'Product Management',
      requiredAccess: 'Product_Management',
    });

    const pageDescription =
        'The Product Management page allows you to view all products in your system, filter and search through them, and perform actions such as adding new products, editing product details, and managing product availability. This interface provides a comprehensive overview of your product catalog, enabling efficient updates and organization. Click on any product to view or edit its information, including name, category, price, and stock status. Use the search and filter tools to quickly locate specific products or categories.';

    // Check if the user has access to this page
    const accessCheckFailed = PageAccessRequirement(
      'admin',
      'Product_Management',
    );  

    if (accessCheckFailed) {
      return accessCheckFailed;
    };

  return (
    <div className="flex flex-row gap-0 bg-background-1">
        <div>
          <AdminSideBar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
        <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
          <ViewProducts
            pageDescription={pageDescription} 
          />
        </div>
      </div>
  )

  return (
    <div>ProductManagementPage</div>
  );
}

export default ProductManagementPage;