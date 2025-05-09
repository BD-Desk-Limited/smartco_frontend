'use client';
import Button from '@/components/account/Button';
import React from 'react';

const page = () => {
  return (
    <div>Edit User page  
        <Button
            text="Go Back"
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        />
    </div>
  )
}

export default page;