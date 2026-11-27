'use client';
// @search upload users, import staff, csv, excel
import CreateBulkUserPage from '@/components/account/admin/users-management/CreateBulkUserPage';
import React from 'react'

const page = () => {
  return (
    <div className='h-full'>
        <CreateBulkUserPage />
    </div>
  )
}

export default page;