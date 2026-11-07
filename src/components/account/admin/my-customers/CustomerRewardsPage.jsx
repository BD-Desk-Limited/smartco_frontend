'use client';
import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import CustomerReward from './components/CustomerReward';

const CustomerRewardsPage = () => {
  const pageDescription =
    'This page allows you to manage customer rewards. You can create customer rewards, set qualifying criteria, set reward limits, qualifying branches, period, and view reward details, edit information, and perform other administrative tasks related to customer rewards.';

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
