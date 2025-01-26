'use client';
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return <div>admin dashboard</div>;
};

export default Page;
