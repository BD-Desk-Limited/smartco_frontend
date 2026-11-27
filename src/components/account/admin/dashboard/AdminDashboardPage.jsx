'use client';
import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import { useSetup } from '@/contexts/setupContext';
import SetUps from './components/setups/SetUps';
import Spinner from '../../Spinner';
import OfflineScreen from '../../OfflineScreen';
import { useInternetStatus } from '@/contexts/internetStatusContext';

const AdminDashboardPage = () => {

  const { setupComplete, setupProgress, loading, isSetUpAdmin, error } =
    useSetup();
  const { internetStatus } = useInternetStatus();

  // Offline: the setup check is skipped, so without this the page would spin forever.
  // If the dashboard already loaded, keep it (the offline banner covers that case).
  if (internetStatus === 'offline' && setupComplete !== true) {
    return (
      <OfflineScreen message="The admin dashboard needs an internet connection. Check your Wi-Fi or mobile data." />
    );
  }

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-1">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600">Error loading setup</p>
          {typeof error === 'string' && (
            <p className="text-sm text-text-gray mt-1">{error}</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {setupComplete === true ? (
        <div className="flex flex-row gap-0 bg-background-1 h-full overflow-hidden ">
          <div className="w-full h-full overflow-y-auto ">
            <AdminDashboard />
          </div>
        </div>
      ) : setupComplete === false ? (
        <SetUps
          setupProgress={setupProgress}
          loading={loading}
          isSetUpAdmin={isSetUpAdmin}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default AdminDashboardPage;
