import React from 'react';
import AdminSideBar from '@/components/account/admin/AdminSideBar';
import BulkMaterialsUpload from './components/BulkMaterialsUpload';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const BulkMaterialsUploadPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Manage Materials',
    icon: '/assets/material.png',
    iconActive: '/assets/material_active.png',
    link: '/manage-materials',
    title: 'Manage Materials',
  });

  const pageDescription = `The Bulk Material Upload page provides you with a template for adding multiple materials to your store(s) at once. This is useful for users who need to add a large number of materials quickly. The template includes fields for specifying material details, categories, and units. Once the template is filled, it can be uploaded to the system, and the materials will be added to your store(s).`;

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
        <BulkMaterialsUpload 
          pageDescription={pageDescription}
        />
      </div>
    </div>
  );
};

export default BulkMaterialsUploadPage;
