import React from 'react';
import { FaBell, FaRegBell, FaReply } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import Image from 'next/image';

const Header = () => {
  const router = useRouter();
  const { user, logOut, isLoading } = useAuth();
  return (
    <div className="h-[5vh] px-5 flex justify-end items-center gap-5 w-full py-7 bg-text-white relative text-brand-green">
      {/* floating back button */}
      <span
        onClick={() => router.back()}
        title="Back to previous page"
        className="bg-text-white
        p-2 shadow-sm
        rounded-l-xl absolute left-2 cursor-pointer hover:bg-gray-border text-base text-brand-blue flex flex-row gap-2"
      >
        <FaReply className="" />
        <span>Back</span>
      </span>

      <div className="flex flex-row gap-5">
        <div>Search bar here</div>
        <div className="flex flex-row justify-between items-center gap-5">
          {/* Notification bell */}
          <p>
            <FaRegBell className="text-lg rotate-12 h-10 cursor-pointer hover:text-green-shadow1 rounded-full " />
          </p>

          {/* user profile */}
          <div
            title="My Profile"
            onClick={() => router.push('/pages/account/admin/my-profile')}
            className="flex flex-row gap-2 items-center hover:shadow-md shadow-brand-green cursor-pointer p-1 rounded-lg"
          >
            {user?.profilePictureUrl ? (
              <Image
                src={user?.profilePictureUrl}
                alt="User Avatar"
                width={30}
                height={30}
                className="border rounded-full h-10 w-10 object-contain"
              />
            ) : (
              <span className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold border">
                {user?.fullName
                  ? user.fullName?.split(' ')[0].charAt(0).toUpperCase() +
                      user.fullName?.split(' ')[1]?.charAt(0).toUpperCase() ||
                    ''
                  : ''}
              </span>
            )}
            <span className="font-semibold text-sm">{`Hello ${user?.fullName?.split(' ')[0] ?? ''},`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
