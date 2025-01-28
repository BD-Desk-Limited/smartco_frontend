'use client';
import React from 'react';
import PictureCarousel from '@/components/auth/PictureCarousel';
import LoginAttempt from '@/components/auth/LoginAttempt';


const page = () => {
    return (
        <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
            <div className="w-[50%] h-full px-[10vw] py-[10vh]">
                <PictureCarousel />
            </div>
            <div className="w-[50%] px-[10vw] items-center justify-center">
                <LoginAttempt />
            </div>
        </div>
    );
};

export default page;
