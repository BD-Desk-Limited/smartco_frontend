'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCompanyData } from '@/contexts/companyDataContext';

export default function Home() {
  const isMounted = useRef(false);
  const router = useRouter();

  const { companyData, setCompanyData } = useCompanyData();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current && companyData?.isLoaded) {
      let timer;

      if (companyData?.id && companyData?.authorizationToken) {
        if (!navigator.onLine) {
          timer = setTimeout(() => {
            router.push('/pages/splash/splash3');
          }, 5000);

          return () => clearTimeout(timer);
        }

        const authorize = async () => {
          try {
            const requestBody = {
              companyId: companyData.id,
              authorizationToken: companyData.authorizationToken,
            };
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
            timer = setTimeout(() => {
              if (companyData?.authorizationToken && data?.isAuthorized) {
                const updatedData = {
                  ...data.companyData,
                  id: data.companyData.id,
                  authorizationToken: data.companyData.authorizationToken,
                  allowedBranches: data.companyData.allowedBranches,
                  isLoaded: true,
                };
                setCompanyData(updatedData);
                router.push('/pages/splash/splash3');
              } else {
                router.push('/pages/auth/login');
              }
            }, 5000);
          } catch (error) {
            console.error(error);
            timer = setTimeout(() => {
              if (companyData?.authorizationToken) {
                router.push('/pages/splash/splash3');
                return;
              }

              router.push('/pages/auth/login');
            }, 5000);
          }
        };
        authorize();
      } else {
        timer = setTimeout(() => {
          router.push('/pages/auth/login');
        }, 5000);
      }
      return () => clearTimeout(timer);
    }
  }, [router, companyData, setCompanyData]);

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
}
