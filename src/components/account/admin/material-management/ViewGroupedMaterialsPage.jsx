"use client";
import React from 'react';
import AdminSideBar from '@/components/account/admin/AdminSideBar';
import ViewGroupedMaterials from './components/groupedMaterials/ViewGroupedMaterials';

const ViewGroupedMaterialPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Materials Management',
    icon: '/assets/material.png',
    iconActive: '/assets/material_active.png',
    link: '/manage-materials',
    title: 'Manage Materials',
  });

const pageDescription =
    'The Grouped Materials Management page allows you to view all grouped materials, edit and delete existing groups, and see detailed information about each group. This interface provides a comprehensive overview of all grouped materials in your store(s), enabling efficient management and updates. You can click on any group to view its details, including its name, description, associated materials, and metadata. Additionally, you have the option to edit group information or delete groups that are no longer needed. Use the search and filter functionalities to quickly find specific grouped materials.';

  return (
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <ViewGroupedMaterials
          pageDescription={pageDescription} 
        />
      </div>
    </div>
  );
};

export default ViewGroupedMaterialPage;