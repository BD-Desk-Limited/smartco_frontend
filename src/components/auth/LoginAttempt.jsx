import React from 'react';
import Image from 'next/image';

const LoginAttempt = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full">

            <div className="relative">
                {/* Shield image */}
                <Image
                    src="/assets/Shield.png"
                    width={138}
                    height={138}
                    alt="Shield"
                />
                {/* Overlay image */}
                <Image
                    src="/assets/Star.png"
                    width={70}
                    height={76}
                    alt="Top Image"
                    className="absolute top-8 right-8"
                />
            </div>

            <h1 className="text-lg/6 text-brand-blue font-medium">
                Login attempt from an Unauthorized Device
            </h1>
            <p className="text-sm text-brand-blue text-center">
                We noticed you are attempting to access your account on an unauthorized device,
                kindly authorize this device to login.
            </p>

            <p className="text-sm text-brand-blue text-center my-2">
                Authorize device for one-time use
            </p>

            <div className="flex flex-col gap-10 w-full">
                <button className="bg-brand-blue py-[10px] px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-white text-lg font-semibold">
                    Authorize Device
                </button>
                <button className="border-brand-blue border-[1px] text-brand-blue py-[10px] px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-lg font-semibold">
                    Proceed for one-time use
                </button>
            </div>
        </div>
    );
};

export default LoginAttempt;
