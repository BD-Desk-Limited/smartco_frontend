'use client';
import React from 'react';
import AdminSideBar from '../AdminSideBar';

const AdminDashboard = () => {
  const selectedMenu = {
    name: 'Dashboard',
    icon: '/assets/dashboard.png',
    iconActive: '/assets/dashboard_active.png',
    link: '/',
    title: 'Dashboard',
  };

  return (
    <div className="flex flex-row gap-10">
      <div>
        <AdminSideBar selectedMenu={selectedMenu} />
      </div>
      <div className="w-full">other components</div>
    </div>
  );
};

export default AdminDashboard;
