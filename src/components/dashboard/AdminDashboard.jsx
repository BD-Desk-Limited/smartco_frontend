'use client';
import React from 'react'
import { useAuth } from '@/contexts/authContext';

const AdminDashboard = () => {
    const { logOut } = useAuth();
  return (
    <div>
        <p>Admin Dashboard</p>
        <button onClick={logOut} className='p-3 bg-brand-blue text-text-white'>Logout</button>
    </div>
  )
}

export default AdminDashboard;