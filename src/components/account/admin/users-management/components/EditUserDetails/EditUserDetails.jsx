import React from 'react'
import UsersManagementSidebar from '../UsersManagementSidebar';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import PageDescription from '@/components/account/PageDescription';
import EditUserForm from './EditUserForm';
import UserPermissionsManagement from './UserPermissionsManagement';
import UserBranchManagement from './UserBranchManagement';

// manage user access if you are a super admin
// manage user roles
// manage user details
// manage user branch
// manage user department if user is an admin
const EditUserDetails = ({pageDescription, userData}) => {
    
  const selectedSubMenu = {
    name: 'View All Users',
    link: '/',
  };
  const [openSidebar, setOpenSidebar] = React.useState(false);

  return (
    <div className='h-screen overflow-y-auto no-scrollbar relative'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full sticky top-14 bg-white z-50">
        <SubHeader title={'Update User Details'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative my-2">
        <div className="min-w-fit">
          <UsersManagementSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full overflow-y-auto no-scrollbar relative'>
          <h1 className='px-5 text-text-black'>Click on any field to update user details...</h1>
          <div className="mx-5 my-2 rounded-md h-full w-full flex flex-row gap-5 max-h-[calc(100vh-10rem)]">
            <div className='w-1/4 h-auto' >
              <EditUserForm 
                userData={userData}
              />
            </div>
            <div className='w-2/4'>
              <UserPermissionsManagement 
                userData={userData} 
              />
            </div>
            <div>
              <UserBranchManagement 
                userData={userData}
              />
            </div>
          </div>
          <div className=''><PageDescription pageDescription={pageDescription}/></div>
        </div>
      </div>
    </div>
  )
}

export default EditUserDetails;