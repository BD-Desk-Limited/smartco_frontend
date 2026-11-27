'use client';
// @search clients, buyers, customers
import CustomerManagementPage from '@/components/account/admin/my-customers/CustomersManagementPage';
import React from 'react';

const page = () => {
  return (
    <div className="h-full">
      <CustomerManagementPage />
    </div>
  );
};

export default page;
