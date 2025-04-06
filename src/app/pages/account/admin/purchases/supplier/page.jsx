"use client";
import { useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
  return (
    <div>suppliers page. ID:{id}</div>
  )
}

export default page;