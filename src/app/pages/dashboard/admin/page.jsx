"use client";
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext';

const Page = () => {
  const { isAuthenticated } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsLoaded(true);
    }
  }, [isAuthenticated]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Render a loading state until the authentication state is loaded
  }

  return (
    <div>
      <AdminDashboard />
    </div>
  );
}

export default Page;