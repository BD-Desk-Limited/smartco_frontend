'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './authContext';
import { useInternetStatus } from './internetStatusContext';
import { checkCompanySetupCompletionService } from '@/services/setupServices';
import Spinner from '@/components/account/Spinner';

const SetupContext = createContext();

//pages that can be accessed whether setup is complete or not by anyone
const publicPaths = ['/pages/auth/', '/pages/splash/'];

// Roles that are exempt from setup restrictions
const rolesExemptFromSetup = ['supplier', 'support'];

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
};

export const SetupProvider = ({ children }) => {
  const [setupComplete, setSetupComplete] = useState(null);
  const [setupProgress, setSetupProgress] = useState({});
  const [isSetUpAdmin, setIsSetUpAdmin] = useState(null);
  const [adminStatusChecked, setAdminStatusChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { internetStatus, userMode } = useInternetStatus();
  const router = useRouter();
  const pathname = usePathname();
  const shouldBypassSetupChecks =
    pathname?.startsWith('/pages/account/sales-point') ||
    pathname?.startsWith('/pages/auth/login/sales-point') ||
    user?.role === 'seller' ||
    internetStatus === 'offline' ||
    userMode === 'offline';

  //Helper Function to get allowed pages from sessionStorage
  const getAllowedPages = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('setupAllowedPages');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error(
          'Error parsing setupAllowedPages from sessionStorage:',
          error
        );
        return [];
      }
    }
    return [];
  }, []);

  // Helper function to check if a page is allowed
  const isPageAllowed = useCallback(
    (pathname) => {
      const allowed = getAllowedPages(); //retrieve latest allowed pages from sessionStorage
      const isPublic = publicPaths.some((path) => pathname.startsWith(path)); //check if page is a public path

      // Always allow public pages
      if (isPublic) {
        return true;
      }

      // If no allowed pages are set, deny access
      if (!allowed || allowed.length === 0) {
        return false;
      }

      // Always allow exact matches
      if (allowed.includes(pathname)) {
        return true;
      }

      return false;
    },
    [getAllowedPages]
  );

  // Helper function to check setup completion and progress
  const checkSetupStatus = useCallback(async () => {
    if (shouldBypassSetupChecks) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await checkCompanySetupCompletionService();

      if (response.data) {
        setSetupComplete(Boolean(response.data.isMandatorySetUpComplete));
        setSetupProgress(response.data);
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [
    setSetupComplete,
    setSetupProgress,
    setLoading,
    setError,
    shouldBypassSetupChecks,
  ]);

  // Check if user is admin and has required access to perform setup. If so, check setup status.
  useEffect(() => {
    const checkAdminStatus = () => {
      if (shouldBypassSetupChecks) {
        setLoading(false);
        return;
      }

      if (!user || adminStatusChecked) return;

      const hasAdminAccess =
        user &&
        (user.superAdmin ||
          (user?.accessLevel
            ?.map((access) => access.accessName)
            .includes('All_Access') &&
            user?.accessLevel?.find(
              (access) => access.accessName === 'All_Access'
            ).accessGranted));

      setIsSetUpAdmin(hasAdminAccess);

      checkSetupStatus();
      setLoading(false);

      setAdminStatusChecked(true);
    };

    checkAdminStatus();
  }, [user, adminStatusChecked, checkSetupStatus, shouldBypassSetupChecks]);

  // Redirect logic based on setup status and allowed pages to track which pages can be accessed during setup by authorized admins
  useEffect(() => {
    if (shouldBypassSetupChecks) {
      return;
    }

    // Don't redirect if still loading or user not loaded
    if (loading || !user || !adminStatusChecked || setupComplete === null) {
      return;
    }

    // If setup is complete, allow all pages
    if (setupComplete) {
      return;
    }

    // if not an admin or any other role not restricted by setup, and company is not set up, redirect to admin home where user can be informed of lack of access
    if (
      !isSetUpAdmin &&
      !setupComplete &&
      !rolesExemptFromSetup.includes(user.role)
    ) {
      router.push('/pages/account/admin');
      return;
    }

    // If mandatory setup is not complete, check if current page is allowed
    if (adminStatusChecked && !setupComplete && !isPageAllowed(pathname)) {
      console.log(
        'Non-admin or exempt role trying to access during setup.',
        'pathAllowed:',
        isPageAllowed(pathname),
        'AdminStatusChecked:',
        adminStatusChecked,
        'isSetupComplete:',
        setupComplete,
        'isSetUpAdmin:',
        isSetUpAdmin,
        'userRole:',
        user.role
      );
      router.push('/pages/account/admin');
      return;
    }
  }, [
    setupComplete,
    isSetUpAdmin,
    loading,
    pathname,
    user,
    router,
    adminStatusChecked,
    isPageAllowed,
    shouldBypassSetupChecks,
  ]);

  // Helper function to determine if we should display any content yet on the page
  const dontDisplayYet = () => {
    if (shouldBypassSetupChecks) {
      return false;
    }

    if (
      !setupComplete &&
      !isPageAllowed(pathname) &&
      pathname !== '/pages/account/admin'
    )
      return true; // Admin on disallowed page during setup
    return false;
  };

  const value = {
    setupComplete,
    setupProgress,
    loading,
    isSetUpAdmin,
    error,
    checkSetupStatus, // Expose this in case we need to refresh setup status
  };

  return (
    <SetupContext.Provider value={value}>
      {dontDisplayYet() ? <Spinner /> : children}
    </SetupContext.Provider>
  );
};
