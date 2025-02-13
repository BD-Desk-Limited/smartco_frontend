import React from 'react';
import AdminSideBar from '@/components/account/admin/AdminSideBar';
import MaterialSidebar from './components/materialSidebar';
import CreateMaterial from './components/CreateMaterial';

const ManageMaterial = () => {
  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Manage Materials',
    icon: '/assets/material.png',
    iconActive: '/assets/material_active.png',
    link: '/manage-materials',
    title: 'Manage Materials',
  });

  const pageDescription =
    'The Material Onboarding page provides you with a comprehensive interface for adding new materials to your store(s). It includes options for specifying material details, creating new categories and units if they are not available, and saving the new material. Additionally, it offers a bulk upload option for users who need to add multiple materials at once. These materials can be used to create new products, and they will be available for selection in the product creation page, alongside any grouped materials.';

  return (
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <CreateMaterial pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default ManageMaterial;
