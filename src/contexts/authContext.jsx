'use client';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getUserService } from '@/services/authServices';

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const syncAuthState = async () => {
      const token = sessionStorage.getItem('token');
      console.log(token);

      if (token !== null) {
        try {
          const decodedToken = jwtDecode(token);

          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            sessionStorage.removeItem('token');

            if (!isCurrent) return;
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            router.push('/pages/splash/splash3');
            return;
          }

          const isSalesPointRoute =
            pathname?.startsWith('/pages/account/sales-point') ||
            pathname?.startsWith('/pages/auth/login/sales-point');
          const isOfflineMode =
            !navigator.onLine || localStorage.getItem('userMode') === 'offline';

          if (!isCurrent) return;

          setIsAuthenticated(true);

          if (isOfflineMode && isSalesPointRoute) {
            localStorage.setItem('userMode', 'offline');
            setUser(decodedToken);
            setIsLoading(false);
            return;
          }

          const userData = await getUserService(token);

          if (!isCurrent) return;

          if (userData?.data) {
            setUser(userData.data);
            setIsLoading(false);
            return;
          }

          const hasRecoverableFetchError =
            !navigator.onLine ||
            userData?.error === 'error getting user details, please try again';

          if (isSalesPointRoute && hasRecoverableFetchError) {
            localStorage.setItem('userMode', 'offline');
            setUser(decodedToken);
            setIsLoading(false);
            return;
          }

          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          router.push('/pages/splash/splash3');
          return;
        } catch (error) {
          if (!isCurrent) return;

          console.error('Auth token decode/rehydration failed:', error);

          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          router.push('/pages/splash/splash3');
          return;
        }
      }

      if (!isCurrent) return;

      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);

      if (
        pathname &&
        !pathname.startsWith('/pages/auth') &&
        !pathname.startsWith('/pages/splash')
      ) {
        router.push('/pages/splash/splash3');
      }
    };

    syncAuthState();

    return () => {
      isCurrent = false;
    };
  }, [router, pathname]);

  const logOut = () => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('userMode');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/pages/splash/splash3');
  };

  const logOutSalesPoint = () => {
    const workBranchKey = `workBranch_${user?._id}`;

    sessionStorage.removeItem('token');
    localStorage.removeItem('userMode');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(workBranchKey);
    router.push('/pages/auth/login/sales-point');
  };

  if (
    !isAuthenticated &&
    pathname &&
    !pathname.startsWith('/pages/auth') &&
    !pathname.startsWith('/pages/splash')
  ) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        logOut,
        logOutSalesPoint,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
