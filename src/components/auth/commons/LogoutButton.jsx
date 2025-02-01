import React from 'react';
import { useAuth } from '@/contexts/authContext';

const LogoutButton = () => {
  const { logOut } = useAuth();
  return (
    <button
      onClick={() => logOut()}
      className="p-2 absolute text-[14px] font-bold right-5 top-9 bg-brand-green border hover:bg-brand_blue text-white rounded-xl"
    >
      Log out
    </button>
  );
};

export default LogoutButton;
