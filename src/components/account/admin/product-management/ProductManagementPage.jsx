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
        'The Product Management page allows you to view all products. Products are finished and packaged items sold over the counter. They are typically displayed in the sales catalog but not in the inventory list. The inventory rather captures raw materials and components that are used to create these finished products. This interface provides a comprehensive overview of your products, enabling efficient updates and organization. Click on any product to view or edit its information, including name, category, price, and stock status. Use the search and filter tools to quickly locate specific products or categories.';

    // Check if the user has access to this page
    const accessCheckFailed = PageAccessRequirement(
      'admin',
      'Product_Management',
    );  

    if (accessCheckFailed) {
      return accessCheckFailed;
    };

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-[100vh] overflow-hidden no-scrollbar">
        <div className='h-full'>
          <AdminSideBar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <ViewProducts
            pageDescription={pageDescription} 
          />
        </div>
      </div>
  );
}

export default ProductManagementPage;