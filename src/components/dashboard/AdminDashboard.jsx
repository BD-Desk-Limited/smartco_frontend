'use client';
import React from 'react';
import SideBar from './AdminSideBar';

const AdminDashboard = () => {

  return (
    <div className='flex flex-row gap-10'>
      <div>
        <SideBar />
      </div>
      <div className='w-full'>
        other components
      </div>
    </div>
  );
}

export default AdminDashboard;