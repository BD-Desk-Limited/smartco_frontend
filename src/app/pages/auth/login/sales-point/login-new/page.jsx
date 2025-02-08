"use client";
import PictureCarousel from '@/components/auth/PictureCarousel';
import Link from 'next/link';
import Image from 'next/image';
import LoginNew from '@/components/auth/sales-point/LoginNew';


const page = () => {

    return (
        <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
          <div className="w-[50%] h-full px-[10vw] py-[10vh]">
            <PictureCarousel />
          </div>
          <div className="w-[50%] px-[10vw] items-center justify-center">
            <LoginNew />
          </div>
          <button>
            <Link href='/pages/splash/splash3'>
                <Image src='/assets/back.png' width={30} height={30} alt='Logo' className='p-1 rounded-[100%] absolute top-5 left-5 bg-brand-blue hover:bg-blue-shadow3'/>
            </Link>
          </button>
        </div>
    );
}

export default page;