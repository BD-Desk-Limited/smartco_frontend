'use client';
import React, { useState } from 'react';
import AdminSideBar from '../AdminSideBar';
import AdminDashboard from './components/AdminDashboard';
import { useSetup } from '@/contexts/setupContext';
import SetUps from './components/setups/SetUps';
import Spinner from '../../Spinner';

const AdminDashboardPage = () => {
  const [selectedMenu, setSelectedMenu] = useState([{
    name: 'Dashboard',
    icon: '/assets/dashboard.png',
    iconActive: '/assets/dashboard_active.png',
    link: '/',
    title: 'Dashboard',
  }]);

  const { 
    setupComplete,
    setupProgress,
    loading,
    isSetUpAdmin,
    error
  } = useSetup();

  if (loading) return <Spinner />;

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen bg-background-1">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600">Error loading setup</p>
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
        <div className="flex flex-row gap-0 bg-background-1 h-[100vh] overflow-hidden no-scrollbar">
          <div className='h-full'>
            <AdminSideBar
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          </div>
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            <AdminDashboard
            />
          </div>
        </div> 
      ) : (
        <SetUps 
          setupProgress={setupProgress}
          loading={loading}
          isSetUpAdmin={isSetUpAdmin}
        />
      )}
    </>
  );
};

export default AdminDashboardPage;