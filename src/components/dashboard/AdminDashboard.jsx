'use client';
import React from 'react'
import { useAuth } from '@/contexts/authContext';
import SideBar from './SideBar';

const AdminDashboard = () => {
    const { logOut } = useAuth();

  return (
    <div className='flex flex-row gap-10'>
        <div>
          <SideBar/>
        </div>
        <div className='w-full'>
          other components
        </div>
    </div>
  )
}

export default AdminDashboard;