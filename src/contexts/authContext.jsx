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

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log('Token:', token);

    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token has expired
          console.log('Token has expired');
          sessionStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          router.push('/pages/auth/login');
        } else {
          // Token is valid
          setIsAuthenticated(true);
          // Set the user object if user is not set
          if (!user) {
            const getUser = async () => {
              const userData = await getUserService(token);
              console.log('User Data:', userData);
              if (userData.data) {
                setUser(userData.data);
              } else {
                console.error('Error getting user data:', userData.error);
                sessionStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
                router.push('/pages/auth/login');
              }
            };
            getUser();
          }
        }
      } catch (error) {
        console.error('Invalid token:', error);
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        router.push('/pages/auth/login');
      }
    } else {
      // No token found
      setIsAuthenticated(false);
      setUser(null);

      if (
        pathname &&
        !pathname.startsWith('/pages/auth') &&
        !pathname.startsWith('/pages/splash')
      ) {
        router.push('/pages/auth/login');
      }
    }
  }, [router, pathname, user]);

  const logOut = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/pages/splash/splash3');
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
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
