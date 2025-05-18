import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import ViewUsers from './components/ViewUsers';


const UserManagementPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Users Management',
    icon: '/assets/user.png',
    iconActive: '/assets/user_active.png',
    link: '/users-management',
    title: 'Users Management',
  });

  const pageDescription =
        'The User Management page allows you to view all users within your system, filter through them, and perform quick actions such as creating a new user, editing user information, and managing user details. This interface provides a comprehensive overview of all users, enabling efficient management and updates. You can click on any user to view their details, including their name, role, and associated metadata. Additionally, you have the option to edit user information or deactivate users that are no longer active. Use the search and filter functionalities to quickly find specific users.';

  // Check if the user has access to this page
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
          <ViewUsers
            pageDescription={pageDescription} 
          />
        </div>
      </div>
  )
}

export default UserManagementPage;