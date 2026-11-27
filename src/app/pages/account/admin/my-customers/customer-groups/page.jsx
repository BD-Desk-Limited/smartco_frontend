'use client';
// Extra words the header search ("Search app") should find this page by.
// See scripts/generateSearchIndex.mjs.
// @search segments, categories, customer tiers
import CustomerGroupsPage from '@/components/account/admin/my-customers/CustomerGroupsPage';
import React from 'react';

const page = () => {
  return (
    <div className="h-full">
      <CustomerGroupsPage />
    </div>
  );
};

export default page;
