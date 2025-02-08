import React from 'react';
import Image from 'next/image';
import ChatIcon from './commons/ChatIcon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/contexts/companyDataContext';

const Welcome = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { companyData } = useCompanyData();

  useEffect(() => {
    if (companyData) {

      const authorize = async () => {
        try {
          const requestBody = {
            companyId: companyData.id,
            authorizationToken: companyData.authorizationToken,
          };

          // Send the company id and the authorization token to the server to check if the device is authorized
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/is-device-authorized`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            }
          );

          const data = await response.json();
            if (companyData.authorizationToken && data.isAuthorized) {
              setIsAuthorized(true);
            } else {
              router.push('/pages/auth/login');
            }

        } catch (error) {
          console.error(error);
          router.push('/pages/auth/login');
        }
      };

      authorize();
    }
  }, [router, companyData]);

  const divStyle = {
    backgroundImage: `url('/images/welcome.png')`,
    backgroundPosition: 'center',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100vw',
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div style={divStyle} className="w-full">
      <div className="absolute bottom-28 left-28 w-[37%] text-white text-[40px] font-serif">
        <div className="relative bg-brand-blue w-full h-full px-6 py-12 opacity-[80%] rounded-3xl">
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black opacity-[70%] z-10 rounded-3xl"></div>

          {/* Content wrapper */}
          <div className="relative z-20 px-5">
            <div className="flex flex-row items-center gap-2">
              <Image
                src="/assets/logo_white.png"
                alt="logo"
                width={50}
                height={50}
              />
              <p className="text-xl font-bold">SmartCo.</p>
            </div>
            <p className="opacity-100 text-brand-green font-bold">Welcome!</p>
            <p className="font-bold">Get a smart view</p>
            <p className="font-bold">of your business</p>
            <p className="text-xs mt-5 ">
              From deep dives into performance metrics to effortless trend
              tracking, we empower you to make data-driven decisions with total
              confidence. Trust in a system that protects your sensitive
              information while providing the ultimate visibility into every
              aspect of your business operations. Take flight with sharper
              insights!
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center absolute bottom-10 text-left left-28 w-80 text-white text-[12px]">
        <p>
          For support or enquiry, please reach out to us through our email{' '}
          <strong>info@bd-desk.com</strong>
        </p>
        <p>All rights reserved BD-Desk Limited &copy;2024.</p>
      </div>
      <div className="absolute h-full justify-center right-28 flex flex-col gap-3">
        <p className="text-text-white text-center">Continue to</p>
        <Link href='/pages/auth/login'>
          <button className="bg-white px-3 py-1 rounded-md text-[16px] text-brand-blue font-bold hover:bg-brand-blue hover:text-white">
            Admin console
          </button>
        </Link>
        <Link href='/pages/auth/login'>
          <button className="bg-white px-3 py-1 rounded-md text-[16px] text-brand-blue font-bold hover:bg-brand-blue hover:text-white">
            Manager dashboard
          </button>
        </Link>
        <Link href='/pages/auth/login/sales-point'>
          <button className="bg-white px-3 py-1 rounded-md text-[16px] text-brand-blue font-bold hover:bg-brand-blue hover:text-white">
            Sales point
          </button>
        </Link>
      </div>
      <ChatIcon />
    </div>
  );
};

export default Welcome;
