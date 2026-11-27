'use client';
import PictureCarousel from '@/components/auth/PictureCarousel';
import SelectSeller from '@/components/auth/sales-point/SellectSeller';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCompanyData } from '@/contexts/companyDataContext';

const SalesPoint = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const { companyData } = useCompanyData();
  // Always derive sellersInfo from companyData and localStorage
  let sellersInfo = null;
  const storedSellersInfo =
    typeof window !== 'undefined' ? localStorage.getItem('sellersInfo') : null;
  if (storedSellersInfo && companyData?.id) {
    const fetchedData = JSON.parse(storedSellersInfo);
    sellersInfo = fetchedData.filter(
      (seller) => seller.companyId === companyData.id
    );
  }

  // No need to sync sellersInfo state from companyData

  return (
    <div className="min-h-dvh w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
      {!selectedSeller && (
        <div className="hidden md:block w-1/2 h-dvh md:px-[5vw] lg:px-[10vw] py-[10vh]">
          <PictureCarousel />
        </div>
      )}
      <div className="w-full md:w-1/2 px-5 sm:px-10 md:px-[5vw] py-16 md:py-8 items-center justify-center">
        <SelectSeller
          selectedSeller={selectedSeller}
          setSelectedSeller={setSelectedSeller}
          sellersInfo={sellersInfo}
        />
      </div>
      {!selectedSeller && (
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
      )}
    </div>
  );
};

export default SalesPoint;
