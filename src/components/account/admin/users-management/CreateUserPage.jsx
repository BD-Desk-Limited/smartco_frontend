import Header from '@/components/account/Header'
import SubHeader from '@/components/account/SubHeader'
import React from 'react';
import CreateUser from './components/create-user/CreateUser';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';

const CreateUserPage = () => {

    const [selectedMenu, setSelectedMenu] = React.useState({
      name: 'Users Management',
      icon: '/assets/user.png',
      iconActive: '/assets/user_active.png',
      link: '/users-management',
      title: 'Users Management',
    });

    const pageDescription =
        'The Create User page allows you to add new users to your system by entering their details such as name, email, role, and other relevant information. After creating a user, you can manage their information, and update their status as needed. Use this interface to efficiently onboard new users and ensure they have the appropriate access and permissions within the system.';

    // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Users_Management',
  );  

  if (accessCheckFailed) {
    return accessCheckFailed;
  };

  return (
    <div className="flex flex-row gap-0 bg-background-1 no-scrollbar max-h-screen overflow-y-auto">
        <div>
          <AdminSideBar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
        <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
          <CreateUser
            pageDescription={pageDescription} 
          />
        </div>
      </div>
  );
};

export default CreateUserPage;