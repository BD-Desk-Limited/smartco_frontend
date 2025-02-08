"use client";
import {useState, useEffect} from 'react';
import LoginExisting from './LoginExisting';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SelectSeller = ({selectedSeller, setSelectedSeller, sellersInfo}) => {

  const router = useRouter();

  useEffect(() => {
    if (sellersInfo && Array.isArray(sellersInfo) && sellersInfo.length === 0) {
      router.push('/pages/auth/login/sales-point/login-new');
    }
  }, [sellersInfo, router]);

  return (
  <div className='w-full'>
    {
      !selectedSeller ?(
        <div className='flex flex-col gap-5 items-center w-full justify-center'>
          <h1 className='text-brand-green text-lg w-full text-center font-semibold'>Login to sales point</h1>
          <div className='w-full flex flex-col gap-1 text-left'>
            <h2 className='font-semibold'>Select seller</h2>
            <hr></hr>
            <div className='h-[60vh] overflow-y-auto w-full scrollbar-thin scrollbar-thumb-brand-gray scrollbar-track-brand-gray'>
              {sellersInfo?.map((seller, index) => (
                <div 
                  key={index} 
                  onClick={()=>setSelectedSeller(seller)} 
                  className='flex flex-row gap-5 items-center my-1 px-5 border border-brand-gray shadow-brand-gray py-1 rounded-lg cursor-pointer hover:bg-brand-green hover:text-text-white'
                >
                  <div className=''>
                    <Image src={seller.imageURL} alt={seller.name} width={30} height={30} className='rounded-[100%]'/>
                  </div>
                  <div>
                    <p className=''>{seller.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr></hr>
          </div>
          
          <button 
            onClick={()=>router.push('/pages/auth/login/sales-point/login-new')}
            className='my-2 py-3 w-full text-brand-green hover:bg-brand-green hover:text-text-white rounded-md shadow-inner border border-brand-green'
          >
            Add new seller
          </button>
        </div>
      ) : (
      <div className='w-full flex flex-col items-center justify-center'>
        <LoginExisting seller={selectedSeller} setSeller={setSelectedSeller}/>
      </div>
      )
    }
  </div>)
}

export default SelectSeller;