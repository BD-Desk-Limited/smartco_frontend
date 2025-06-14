import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import BulkUserUpload from './components/create-bulk-user/BulkUserUpload';

const CreateBulkUserPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Users Management',
    icon: '/assets/user.png',
    iconActive: '/assets/user_active.png',
    link: '/users-management',
    title: 'Users Management',
  });

  const pageDescription = `The Bulk User Creation page allows you to add multiple users to your system at once using a template. This is ideal for administrators who need to onboard several users quickly. The template includes fields for user details such as name, email, and role. After filling out the template, you can upload it here to create all the users in one step. Note that only non-administrative users can be created in bulk.`;

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
        <BulkUserUpload
          pageDescription={pageDescription}
        />
      </div>
    </div>
  );
};

export default CreateBulkUserPage;