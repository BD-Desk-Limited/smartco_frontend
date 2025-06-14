import React from 'react';
import AdminSideBar from '@/components/account/admin/AdminSideBar';
import BulkUserUploadReview from './components/create-bulk-user/BulkUserUploadReview';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const BulkUploadReviewPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState({
      name: 'Users Management',
      icon: '/assets/user.png',
      iconActive: '/assets/user_active.png',
      link: '/users-management',
      title: 'Users Management',
    });

const pageDescription = 'The bulk user upload review page provides a comprehensive interface for reviewing the users you have uploaded in bulk. You can verify user details, make necessary corrections, and confirm the list before finalizing the upload. This process helps ensure that all user information is accurate and ready for addition to the system.';

  const accessCheckFailed = PageAccessRequirement(
   'admin',
   'Users_Management',
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
        <BulkUserUploadReview
          pageDescription={pageDescription} 
        />
      </div>
    </div>
  );
};

export default BulkUploadReviewPage;
