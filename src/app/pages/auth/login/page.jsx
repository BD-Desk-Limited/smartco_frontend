'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PictureCarousel from '@/components/auth/PictureCarousel';
import LoginForm from '@/components/auth/LoginForm';

const page = () => {
  return (
    <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      <div className="w-[50%] h-full px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-[50%] px-[10vw] items-center justify-center">
        <LoginForm />
      </div>
      <button title="Back" className="">
        <Link href="/pages/splash/splash3">
          <Image
            src="/assets/back.png"
            width={30}
            height={30}
            alt="Logo"
            className="p-1 rounded-[100%] absolute top-5 left-5 bg-brand-blue hover:bg-blue-shadow3"
          />
        </Link>
      </button>
      {/*copy right footer subtexts */}
      
      <div className="absolute bottom-5 left-5 text-text-black text-sm">
        <p className="text-text-black text-sm">
          © 2024 All rights reserved.
          <Link href={process.env.NEXT_PUBLIC_WEBSITE_URL} target='_blank' className="text-brand-blue hover:underline">
            BD-Desk LTD.
          </Link>
          |{' '}
          <Link href="/pages/auth/privacy" target='_blank' className="text-brand-blue hover:underline">
            Privacy Policy
          </Link>{' '}
          |{' '}
          <Link href="/pages/auth/terms" target='_blank' className="text-brand-blue hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
