'use client';

import NewCustomerRegistration from '@/components/account/seller/sales-point/customer-registration/NewCustomerRegistration';
import React from 'react';

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <NewCustomerRegistration
        mode="light"
        lightThemeStyle="bg-white text-gray-900"
        darkThemeStyle="bg-gray-900 text-white"
      />
    </div>
  );
};

export default Page;
