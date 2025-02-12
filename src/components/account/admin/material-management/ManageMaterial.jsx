import React from 'react'
import AdminSideBar from '@/components/account/admin/AdminSideBar';
import MaterialSidebar from './components/materialSidebar';
import CreateMaterial from './components/CreateMaterial';

const ManageMaterial = () => {

  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Manage Materials',
    icon: '/assets/material.png',
    iconActive: '/assets/material_active.png',
    link: '/manage-materials',
    title: 'Manage Materials'
  });

    return (
      <div className='flex flex-row gap-0 bg-background-1'>
        <div>
          < AdminSideBar 
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
        <div className='w-full'>
          <CreateMaterial/>
        </div>
      </div>
    );
  }

export default ManageMaterial;