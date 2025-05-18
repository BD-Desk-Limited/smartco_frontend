import Header from '@/components/account/Header'
import SubHeader from '@/components/account/SubHeader'
import React from 'react'
import UsersManagementSidebar from './UsersManagementSidebar'

const CreateUser = () => {
    const selectedSubMenu = {
        name: 'Users Management',
        icon: '/assets/user.png',
        iconActive: '/assets/user_active.png',
        link: '/users-management',
        title: 'Users Management',
      };
    const [openSidebar, setOpenSidebar] = React.useState(false);


  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'Create a new User'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <UsersManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">


          </div>
        </div>
      </div>

    </div>
  )
}

export default CreateUser