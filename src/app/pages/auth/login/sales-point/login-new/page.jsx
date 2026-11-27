'use client';
import PictureCarousel from '@/components/auth/PictureCarousel';
import Link from 'next/link';
import Image from 'next/image';
import LoginNew from '@/components/auth/sales-point/LoginNew';

const page = () => {
  return (
    <div className="min-h-dvh w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      <div className="hidden md:block w-1/2 h-dvh md:px-[5vw] lg:px-[10vw] py-[10vh]">
        <PictureCarousel />
      </div>
      <div className="w-full md:w-1/2 px-5 sm:px-10 md:px-[5vw] lg:px-[10vw] py-16 md:py-8 items-center justify-center">
        <LoginNew />
      </div>
      <button>
        <Link href="/pages/splash/splash3">
          <Image
            src="/assets/back.png"
            width={30}
            height={30}
            alt="Logo"
            className="p-1 rounded-[100%] absolute top-3 left-3 md:top-5 md:left-5 bg-brand-blue hover:bg-blue-shadow3"
          />
        </Link>
      </button>
    </div>
  );
};

export default page;
