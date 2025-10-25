'use client';
import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import CreateProducts from './components/create-products/CreateProducts';

const CreateProductPage = () => {

    const [selectedMenu, setSelectedMenu] = React.useState({
      name: 'Products',
      icon: '/assets/product.png',
      iconActive: '/assets/product_active.png',
      link: '/product-management',
      title: 'Product Management',
      requiredAccess: 'Product_Management',
    });

    const pageDescription =
        'The Create Product page allows you to add new finished and packaged items by selecting component materials and products. Here, you can enter product details such as name, category, price, and stock status. Once created, products will appear in the store front sales display and can be managed from the Product Management page. Use this interface to efficiently organize and expand your product offerings.';
        
    // Check if the user has access to this page
    const accessCheckFailed = PageAccessRequirement(
      'admin',
      'Products_Management',
    );  

    if (accessCheckFailed) {
      return accessCheckFailed;
    }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-[100vh] overflow-hidden no-scrollbar">
      <div className='h-full'>
        <AdminSideBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
      <div className="w-full h-full overflow-y-auto no-scrollbar">
        <CreateProducts
          pageDescription={pageDescription} 
        />
      </div>
    </div>
  );
}

export default CreateProductPage;