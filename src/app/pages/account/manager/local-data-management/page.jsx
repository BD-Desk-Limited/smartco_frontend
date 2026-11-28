'use client';
import UnsyncedDataCheckPage from '@/components/account/manager/LocalDataManagement/UnsyncedDataCheckPage';
import { PageAccessRequirement } from '@/components/account/common/PageAccessRequirement';
import React from 'react';

const Page = () => {
  // manager pages are for managers only
  const accessCheckFailed = PageAccessRequirement('manager', '');
  if (accessCheckFailed) return accessCheckFailed;
  return (
    <div className="">
      <UnsyncedDataCheckPage />
    </div>
  );
};

export default Page;
