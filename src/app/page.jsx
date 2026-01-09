'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if on the root path
    if (window.location.pathname === '/') {
      router.replace('/pages/splash/splash1');
    }
  }, [router]);

  return null;
}
