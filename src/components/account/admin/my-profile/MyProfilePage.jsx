import React from 'react';
import Spinner from '../../Spinner';
import { useAuth } from '@/contexts/authContext';
import AdminSideBar from '../AdminSideBar';
import MyProfile from './components/MyProfile';

const MyProfilePage = () => {
  const { user, logOut, isLoading } = useAuth();
  const [selectedMenu, setSelectedMenu] = React.useState('my-profile');

  if (!isLoading && (!user || user?.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-1">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 text-lg">
            Cannot find admin user information!!!
          </p>
          <button
            onClick={logOut}
            className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-md"
          >
            Go back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-row gap-0 bg-background-1 h-[100vh] overflow-hidden no-scrollbar">
          <div className="h-full">
            <AdminSideBar
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          </div>
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            <MyProfile />
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfilePage;
