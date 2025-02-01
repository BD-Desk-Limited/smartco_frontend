'use client'
import React, { useEffect, useState } from 'react'
import PictureCarousel from '@/components/auth/PictureCarousel'
import ResetPassword from '@/components/auth/ResetPassword'
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const Page = () => {
    return (
        <Suspense fallback={<div className="items-center gap-3 flex justify-center">
            <div className="loader border-t-4 border-text-blue rounded-full w-16 h-16 animate-spin"></div>
            <p className="text-text-blue ml-3 ">Loading...</p>
        </div>}>
            <InnerPage />
        </Suspense>
    );
};

const InnerPage = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            console.log('Token received:', token);
        }
    }, [token]);

    if (!token) {
        return (
            <div className='flex items-center'>
                <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-white border-text-blue rounded-full mr-2"></div>
                <span className='text-text-blue font-bold'>Loading...</span>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
            <div className="w-[50%] h-full px-[10vw] py-[10vh]">
                <PictureCarousel />
            </div>
            <div className="w-[50%] px-[10vw] items-center justify-center">
                <ResetPassword token={token} />
            </div>
        </div>
    );
};

export default Page;
