'use client';
// @search account, settings, my details, profile picture
import { Suspense } from 'react';
import MyProfilePage from '@/components/account/admin/my-profile/MyProfilePage';
import Spinner from '@/components/account/Spinner';

// Suspense is required because the profile reads ?tab= (useSearchParams).
const page = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <MyProfilePage />
      </Suspense>
    </div>
  );
};

export default page;
