import React from 'react';
import Image from 'next/image';
import { FaReply, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { firstName, initials } from '@/utilities/stringUtils';
import { PageDescriptionButton } from '@/components/account/common/PageDescriptionSlot';
import NotificationBell from '@/components/notifications/NotificationBell';


// Top bar on every manager page, laid out like the admin header (h-14). On phones the Back label and
// the greeting are hidden, and Log out is here because there is no sidebar.
const ManagerHeader = () => {
  const router = useRouter();
  const { user, logOut } = useAuth();
  return (
    <header className="h-14 px-2 md:px-5 flex justify-between items-center gap-2 md:gap-5 w-full bg-text-white text-brand-green shadow-sm">
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
        <PageDescriptionButton />
        <NotificationBell className="hover:text-green-shadow1" />
        <span className="flex flex-row gap-2 items-center p-1 shrink-0">
          {user?.profilePictureUrl ? (
            <Image
              src={user.profilePictureUrl}
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
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">{`Hello ${firstName(user?.fullName)},`}</span>
        </span>
        <button
          type="button"
          onClick={logOut}
          title="Log out"
          aria-label="Log out"
          className="md:hidden p-2 text-error"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default ManagerHeader;
