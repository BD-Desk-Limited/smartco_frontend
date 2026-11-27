'use client';
import React from 'react';
import PictureCarousel from '@/components/auth/PictureCarousel';
import ForgotPassword from '@/components/auth/ForgotPassword';

const page = () => {
  return (
    <div className="min-h-dvh w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      <div className="hidden md:block w-1/2 h-dvh md:px-[5vw] lg:px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-full md:w-1/2 px-5 sm:px-10 md:px-[5vw] lg:px-[10vw] py-16 md:py-8 items-center justify-center">
        <ForgotPassword />
      </div>
    </div>
  );
};

export default page;
