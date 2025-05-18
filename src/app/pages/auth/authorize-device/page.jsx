'use client';
import React, { useEffect } from 'react';
import PictureCarousel from '@/components/auth/PictureCarousel';
import { useAuth } from '@/contexts/authContext';
import Image from 'next/image';
import LoginAuthorize from '@/components/auth/LoginAuthorize';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  const goBack = () => {
    router.push('/pages/auth/login-attempt-notification');
  };

  if (!user || user?.role !== 'admin') {
    return (
      <div className="flex flex-col h-screen justify-center items-center gap-4">
        <Image src="/assets/Danger.png" width={100} height={100} alt="403" />
        <p className="text-error">
          This device is not authorized for your company use. Contact your Admin
          or IT support for assistance.
        </p>
        <button
          onClick={goBack}
          className="bg-error text-white px-4 py-2 rounded-md hover:bg-opacity-80"
        >
          Ok
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      <div className="w-[50%] h-full px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-[50%] px-[10vw] items-center justify-center">
        <LoginAuthorize />
      </div>
      <button onClick={goBack}>
        <Image
          src="/assets/back.png"
          width={30}
          height={30}
          alt="Logo"
          className="p-1 rounded-[100%] absolute top-5 left-5 bg-brand-blue hover:bg-blue-shadow3"
        />
      </button>
    </div>
  );
};

export default Page;
