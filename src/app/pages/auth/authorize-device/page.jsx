'use client';
import React, { useEffect } from 'react';
import PictureCarousel from '@/components/auth/PictureCarousel';
import LoginAuthorize from '@/components/auth/LoginAuthorize';
import { useAuth } from '@/contexts/authContext';

const Page = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user?.role !== 'admin') {
      const timeout = setTimeout(() => {
        window.location.href = '/pages/auth/login';
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  if (!user || user?.role !== 'admin') {
    return (
      <div className='flex flex-col h-screen justify-center items-center gap-4'>
        <p className='text-error'>
          This device is not authorized for your company use. Contact your Admin or IT support for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      <div className="w-[50%] h-full px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-[50%] px-[10vw] items-center justify-center">
        <LoginAuthorize />
      </div>
    </div>
  );
};

export default Page;