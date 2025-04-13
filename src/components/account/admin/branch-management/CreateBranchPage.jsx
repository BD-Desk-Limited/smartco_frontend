import React from 'react'
import CreateBranch from './components/CreateBranch';
import AdminSideBar from '../AdminSideBar';

const CreateBranchPage = () => {
    const [selectedMenu, setSelectedMenu] = React.useState({
        name: 'Branch Management',
        icon: '/assets/store.png',
        iconActive: '/assets/branch.png',
        link: '/branch-management',
        title: 'Branch Management',
    });
  
    const pageDescription =
        'The Create Branch page allows you to add a new branch to your company. This interface enables you to input essential branch details such as name, location, and associated metadata. Additionally, you can assign the branch to a specific band, which is used to monitor groups of branches with similar attributes, such as sales price of their products, etc. This functionality ensures efficient organization and management of branches within your company.';
  
    return (
      <div className="flex flex-row gap-0 bg-background-1">
        <div>
          <AdminSideBar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
        <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
          <CreateBranch
            pageDescription={pageDescription} 
          />
        </div>
      </div>
    );
}

export default CreateBranchPage;