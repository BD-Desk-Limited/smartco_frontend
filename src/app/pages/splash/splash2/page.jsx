'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCompanyData } from '@/contexts/companyDataContext';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { companyData } = useCompanyData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (companyData) {
      console.log('companyData', companyData);

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
          console.log('data', data);

          const timer = setTimeout(() => {
            if (companyData.authorizationToken && data.isAuthorized) {
              router.push('/pages/splash/splash3');
            } else {
              router.push('/pages/auth/login');
            }
          }, 5000);

          return () => clearTimeout(timer);
        } catch (error) {
          console.error(error);
          const timer = setTimeout(() => {
            router.push('/pages/auth/login');
          }, 5000);

          return () => clearTimeout(timer);
        }
      };

      authorize();
    } else {
      const timer = setTimeout(() => {
        router.push('/pages/auth/login');
      }, 5000);

      return () => clearTimeout(timer);
    }
    
  }, [router, companyData]);

  return (
    <div className="min-h-screen min-w-full bg-brand-blue flex items-center justify-center overflow-hidden relative">
      <motion.h1
        className="text-white text-5xl font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3 }}
      >
        <Image
          src="/assets/logo_long.png"
          alt="Logo"
          width={400}
          height={400}
        />
      </motion.h1>
      <div className="absolute bottom-[-20vh] left-[-10vw]">
        <Image
          src="/assets/brand_mark1.png"
          alt="Logo"
          width={450}
          height={450}
        />
      </div>
      <div className="absolute bottom-[25vh] right-[-10vw]">
        <Image
          src="/assets/brand_mark1.png"
          alt="Logo"
          width={450}
          height={450}
        />
      </div>
    </div>
  );
};
