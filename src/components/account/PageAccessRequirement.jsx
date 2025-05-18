import React from 'react';
import Button from './Button';
import { useAuth } from '@/contexts/authContext';

export const PageAccessRequirement = (requiredRole, requiredAccess) => {
  const { user, isAuthenticated } = useAuth();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    window.location.href = '/pages/splash/splash3';
    return null; // Prevent rendering the rest of the component
  }

  // Check if the user meets the conditions to access the page
  const allActiveUserAccess = user?.accessLevel.length > 0 &&
    user?.accessLevel.filter(access => access.accessGranted === true) || [];

  
  const conditionsToShowPage = (
    user?.role === requiredRole &&
    (
      allActiveUserAccess.map((access) => access.accessName).includes(requiredAccess) || 
      user?.superAdmin || 
      user?.accessLevel.map((access) => access.accessName).includes('All_Access')
    )
  );

  // If access is denied, show the "No Permission" page
  if (user && !conditionsToShowPage) {
    return <PageAccessDenied />;
  }

  // If all conditions are met, allow the page to render
  return null;
};



const PageAccessDenied = () => {
  const { user } = useAuth();

  const whereToRedirect = () => {
    if (user?.role === 'admin') {
      return '/pages/account/admin';
    } else if (user?.role === 'manager') {
      return '/pages/account/manager';
    } else if (user?.role === 'seller') {
      return '/pages/account/sales-point';
    }
    return '/pages/splash/splash3';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-background-1 gap-5">
      <h1 className="text-l font-bold text-center text-error">
        You do not have permission to view this page!!!
      </h1>
      <Button text={'Back'} onClick={() => (window.location.href = whereToRedirect())} />
    </div>
  );
};