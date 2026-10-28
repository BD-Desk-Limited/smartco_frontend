'use client';
import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import CustomerReward from './components/CustomerReward';

const CustomerRewardsPage = () => {
  const pageDescription = ' ';

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
        <CustomerReward pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CustomerRewardsPage;
