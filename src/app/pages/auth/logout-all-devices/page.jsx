'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PictureCarousel from '@/components/auth/PictureCarousel';
import LogoutAllDevices from '@/components/auth/LogoutAllDevices';

// Link from the login notification email:
//   {FRONTEND_URL}/pages/auth/logout-all-devices?token=<12h link token>
const Page = () => (
  <Suspense
    fallback={
      <div className="h-screen flex items-center justify-center gap-3">
        <div className="loader border-t-4 border-text-blue rounded-full w-16 h-16 animate-spin" />
        <p className="text-text-blue">Loading...</p>
      </div>
    }
  >
    <InnerPage />
  </Suspense>
);

const InnerPage = () => {
  const token = useSearchParams().get('token');

  return (
    <div className="min-h-screen w-full bg-white text-text-black text-base flex flex-row items-center justify-center">
      <div className="hidden md:block w-1/2 h-screen px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-full md:w-1/2 px-6 md:px-[8vw] py-10 flex items-center justify-center">
        <LogoutAllDevices token={token} />
      </div>
    </div>
  );
};

export default Page;
