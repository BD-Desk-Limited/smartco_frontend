'use client';
// Extra words the header search ("Search app") should find this page by.
// See scripts/generateSearchIndex.mjs.
// @search reward points, loyalty, points, bonus
import CustomerRewardsPage from '@/components/account/admin/my-customers/CustomerRewardsPage';
import React from 'react';

const page = () => {
  return (
    <div className="h-full">
      <CustomerRewardsPage />
    </div>
  );
};

export default page;
