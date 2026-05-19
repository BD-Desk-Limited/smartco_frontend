'use client';
import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import EditableProductDetails from './components/edit-product/EditableProductDetails';

const EditProductPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState('my-products');

  const pageDescription =
    'The Edit Product page allows you to update details of an existing finished product. You can modify its name, description, category, image, pricing across bands, tax details, and component materials/options. Use this interface to keep product information accurate and aligned with current inventory and pricing policies.';

  // Check access
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Products_Management'
  );
  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-[100vh] overflow-hidden no-scrollbar">
      <div className="h-full">
        <AdminSideBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
      <div className="w-full h-full overflow-y-auto no-scrollbar">
        <EditableProductDetails pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default EditProductPage;
