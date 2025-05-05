import React from 'react'
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import BulkBranchUpload from './components/BulkBranchUpload';

const BulkBranchUploadPage = () => {
    const [selectedMenu, setSelectedMenu] = React.useState({
        name: 'Branch Management',
        icon: '/assets/store.png',
        iconActive: '/assets/branch.png',
        link: '/branch-management',
        title: 'Branch Management',
    });

    const pageDescription = `The Bulk Branch Creation page provides you with a template for adding multiple branches to your company at once. This is useful for users who need to add a large number of branches quickly. The template includes fields for specifying branch details such as name, address, branch ID, email, phone number, band, tax band, opening hour, and closing hour. Once the template is filled, it can be uploaded to the system, and the branches will be added to your company.`;

    // Check if the user has access to this page
    const accessCheckFailed = PageAccessRequirement(
      'admin',
      'Branch_Management',
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
        <BulkBranchUpload
            pageDescription={pageDescription}
        />
      </div>
    </div>
  )
}

export default BulkBranchUploadPage;