"use client";
// @search staff, employees, workers, team, sellers, managers
import React from 'react';
import UserManagementPage from '@/components/account/admin/users-management/UserManagementPage';

const page = () => {
  return (
    <div className="h-full">
        <UserManagementPage />
    </div>
  )
}

export default page;
