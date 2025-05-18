"use client";
import React from 'react';
import AdminSideBar from '@/components/account/admin/AdminSideBar';
import ViewMaterial from './components/ViewMaterials';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const ViewMaterialPage = () => {

  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Materials Management',
    icon: '/assets/material.png',
    iconActive: '/assets/material_active.png',
    link: '/manage-materials',
    title: 'Manage Materials',
  });
  
  const pageDescription =
    'The Material Management page allows you to view all materials, edit and delete existing materials, and see detailed information about each material. This interface provides a comprehensive overview of all materials in your store(s), enabling efficient management and updates. You can click on any material to view its details, including its name, description, stock balance and associated metadata. Additionally, you have the option to edit material information or delete materials that are no longer needed. Use the search and filter functionalities to quickly find specific materials.';


  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Materials_Management',
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
        <ViewMaterial
          pageDescription={pageDescription} 
        />
      </div>
    </div>
  );
};

export default ViewMaterialPage;