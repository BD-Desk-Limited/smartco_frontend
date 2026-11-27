"use client";
// @search upload branches, import branches, csv, excel
// @search-title Bulk Branch Upload
import BulkBranchUploadPage from '@/components/account/admin/branch-management/BulkBranchUploadPage';
import React from 'react';

const page = () => {
  return (
    <div className="h-full">
        <BulkBranchUploadPage />
    </div>
  )
}

export default page;