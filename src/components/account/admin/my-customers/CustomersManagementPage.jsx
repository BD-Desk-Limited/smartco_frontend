'use client';
import React from 'react';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';
import MyCustomers from './components/MyCustomers';

const CustomerManagementPage = () => {
  const pageDescription =
    'This page allows you to manage your customers. You can view customer details, edit information, and perform other administrative tasks related to customer management.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Customer_Management'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <MyCustomers pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CustomerManagementPage;
