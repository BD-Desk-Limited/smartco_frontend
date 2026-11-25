'use client';
import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import CustomerGroups from './components/CustomerGroups';

const CustomerGroupsPage = () => {
  const pageDescription =
    'Customer groups are a way to categorize and manage your customers based on specific criteria. This page allows you to create, edit, and manage customer groups, set group criteria, and view group details. You can also assign customers to different groups and perform other administrative tasks related to customer group management.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Customer_Management'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar selectedMenu="my-customers" />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <CustomerGroups pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CustomerGroupsPage;
