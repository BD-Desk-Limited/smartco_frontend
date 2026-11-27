import React from 'react';
import { FaRegBell, FaReply } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import Image from 'next/image';
import AppSearch from './AppSearch';
import { PageDescriptionButton } from './shell/PageDescriptionSlot';

const initials = (fullName = '') => {
  const [first = '', second = ''] = fullName.split(' ');
  return (first.charAt(0) + second.charAt(0)).toUpperCase();
};

// Top bar on every admin page. Fixed height (h-14) so sticky sub headers can sit
// right under it (top-14). On phones the Back label and the greeting are hidden,
// and the page description sits behind the lightbulb button.
const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  return (
    <header className="h-14 px-2 md:px-5 flex justify-between items-center gap-2 md:gap-5 w-full bg-text-white text-brand-green">
      <button
        type="button"
        onClick={() => router.back()}
        title="Back to previous page"
        aria-label="Back to previous page"
        className="bg-text-white p-2 shadow-sm rounded-l-xl cursor-pointer hover:bg-gray-border text-base text-brand-blue flex flex-row items-center gap-2 shrink-0"
      >
        <FaReply />
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="flex flex-row gap-3 md:gap-5 items-center min-w-0">
        <AppSearch />
        <PageDescriptionButton />
        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="shrink-0 p-1 hover:text-green-shadow1"
        >
          <FaRegBell className="text-lg" />
        </button>

        {/* user profile */}
        <button
          type="button"
          title="My Profile"
          aria-label="My Profile"
          onClick={() => router.push('/pages/account/admin/my-profile')}
          className="flex flex-row gap-2 items-center hover:shadow-md shadow-brand-green cursor-pointer p-1 rounded-lg shrink-0"
        >
          {user?.profilePictureUrl ? (
            <Image
              src={user?.profilePictureUrl}
              alt="User Avatar"
              width={30}
              height={30}
              className="border rounded-full h-9 w-9 md:h-10 md:w-10 object-contain"
            />
          ) : (
            <span className="w-9 h-9 md:w-10 md:h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold border">
              {initials(user?.fullName)}
            </span>
          )}
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">{`Hello ${user?.fullName?.split(' ')[0] ?? ''},`}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
