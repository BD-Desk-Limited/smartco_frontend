import React from 'react'
import AdminSideBar from '../AdminSideBar';
import ViewBranches from './components/ViewBranches';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const BranchManagementPage = () => {
    const [selectedMenu, setSelectedMenu] = React.useState({
        name: 'Branch Management',
        icon: '/assets/store.png',
        iconActive: '/assets/branch.png',
        link: '/branch-management',
        title: 'Branch Management',
    });
  
    const pageDescription =
        'The Branch Management page allows you to view all branches within your company, filter through them, and perform quick actions such as creating a new branch, editing branch information, and managing branch details. This interface provides a comprehensive overview of all branches, enabling efficient management and updates. You can click on any branch to view its details, including its name, location, and associated metadata. Additionally, you have the option to edit branch information or delete branches that are no longer needed. Use the search and filter functionalities to quickly find specific branches.';
  
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
          <ViewBranches
            pageDescription={pageDescription} 
          />
        </div>
      </div>
    );
};

export default BranchManagementPage;