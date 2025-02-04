"use client";
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
          router.push('/pages/auth/login');
        } else {
          // Token is valid
          setIsAuthenticated(true);
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
  }, [router]);

  const logOut = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/pages/auth/login');
  };

  if (
    !isAuthenticated &&
    pathname &&
    !pathname.startsWith('/pages/auth') &&
    !pathname.startsWith('/pages/splash')
  ) {
    return null;
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