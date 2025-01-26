'use client';
import React from 'react';
import PictureCarousel from '@/components/auth/PictureCarousel';

const page = () => {
  return (
    <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      <div className="w-[50%] h-full px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-[50%] px-[10vw] items-center justify-center">
        Authorization page
      </div>
    </div>
  );
};

export default page;
