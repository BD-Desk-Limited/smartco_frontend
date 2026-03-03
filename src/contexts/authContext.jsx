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
    // Check for token in sessionStorage (used by all users now)
    const token = sessionStorage.getItem('token');
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token has expired
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          router.push('/pages/splash/splash3');
        } else {
          setIsAuthenticated(true);
          const getUser = async () => {
            try {
              const userData = await getUserService(token);
              if (userData.data) {
                setUser(userData.data);
              } else {
                sessionStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
                router.push('/pages/splash/splash3');
              }
            } catch (error) {
              console.error('Error fetching user:', error);
              sessionStorage.removeItem('token');
              setIsAuthenticated(false);
              setUser(null);
              router.push('/pages/splash/splash3');
            } finally {
              setIsLoading(false);
            }
          };
          getUser();
        }
      } catch (error) {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        router.push('/pages/splash/splash3');
      }
    } else {
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
    }
    // Only run on mount and when router/pathname changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname]);

  const logOut = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/pages/splash/splash3');
  };

  const logOutSalesPoint = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('work-branch');
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
