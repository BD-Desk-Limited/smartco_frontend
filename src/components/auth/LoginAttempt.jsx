import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LoginAttempt = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div className="relative">
        {/* Shield image */}
        <Image src="/assets/Shield.png" width={138} height={138} alt="Shield" />
        {/* Overlay image */}
        <Image
          src="/assets/Star.png"
          width={70}
          height={76}
          alt="Top Image"
          className="absolute top-8 right-8"
        />
      </div>

      <h1 className="text-lg/6 text-error font-medium">
        Login attempt from an Unauthorized Device
      </h1>
      <p className="text-sm text-brand-blue text-center">
        We noticed you are attempting to access your account on an unauthorized
        device, kindly authorize this device to login.
      </p>

      <p className="text-sm text-brand-blue text-center my-2">
        Authorize device for one-time use
      </p>

      <div className="flex flex-col gap-10 w-full">
        <button
          onClick={openModal}
          className="bg-brand-blue hover:bg-blue-shadow5 py-[10px] px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-white text-lg font-semibold"
        >
          Authorize Device
        </button>
        <Link
          href="/pages/account/admin"
          className="border-blue-shadow5 hover:bg-blue-shadow5 hover:text-text-white border-[1px] text-brand-blue py-[10px] px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-lg font-semibold"
        >
          Proceed for one-time use
        </Link>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-6 flex flex-col justify-center items-center gap-6 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-text-black">
              Authorization
            </h2>
            <Image
              src="/assets/Danger.png"
              width={64}
              height={64}
              alt="Danger"
            />
            <p className="text-sm text-text-black">
              Authorizing this device means you and any one in your company can
              access their account through this device.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={closeModal}
                className="text-text-black text-sm font-semibold border-[0.5px] flex items-center border-blue-shadow9 px-4 py-2 gap-2 rounded-md hover:bg-blue-shadow5"
              >
                Cancel
              </button>
              <Link
                href="/pages/auth/authorize-device"
                className="bg-brand-blue text-sm font-semibold text-white px-4 py-2 rounded-md hover:bg-blue-shadow5"
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAttempt;
