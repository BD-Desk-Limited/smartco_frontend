import CustomerSelfRegistration from '@/components/account/seller/sales-point/customer-registration/CustomerSelfRegistration';
import React, { Suspense } from 'react';

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Suspense fallback={null}>
        <CustomerSelfRegistration />
      </Suspense>
    </div>
  );
};

export default Page;
