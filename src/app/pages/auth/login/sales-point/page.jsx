"use client";
import PictureCarousel from '@/components/auth/PictureCarousel';
import SelectSeller from '@/components/auth/sales-point/SellectSeller';
import Link from 'next/link';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import { useCompanyData } from '@/contexts/companyDataContext';


const page = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellersInfo, setSellersInfo] = useState(null);
  const { companyData } = useCompanyData();
  
  useEffect(() => {
    //get the sellersInfo for the company
    const storedSellersInfo = localStorage.getItem('sellersInfo');

    // Parse the JSON string back into an array
    const fetchedData = storedSellersInfo
    ? JSON.parse(storedSellersInfo)
    : [];

    const companySellersInfo = fetchedData && fetchedData?.filter(seller => seller.companyId === companyData?.id);
      setSellersInfo(companySellersInfo);
  }, [companyData]);

  return (
      <div className="h-screen w-full bg-white text-text-black text-base flex items-center flex-row justify-center">
        {!selectedSeller &&
          <div className="w-[50%] h-full px-[10vw] py-[10vh]">
            <PictureCarousel />
          </div>
        }
        <div className="w-[50%] px-[5vw] items-center justify-center">
          <SelectSeller 
            selectedSeller={selectedSeller}
            setSelectedSeller={setSelectedSeller}
            sellersInfo={sellersInfo}
          />
        </div>
        {!selectedSeller&&
          <button>
            <Link href='/pages/splash/splash3'>
                <Image src='/assets/back.png' width={30} height={30} alt='Logo' className='p-1 rounded-[100%] absolute top-5 left-5 bg-brand-blue hover:bg-blue-shadow3'/>
            </Link>
          </button>
        }
      </div>
  );
}

export default page;