'use client';

import React from 'react';
import { useAuth } from '@/contexts/authContext';
import ManagerHeader from './ManagerHeader';
import { usePathname } from 'next/navigation';
import { useSetup } from '@/contexts/setupContext';
import ManagerSideBar from './ManagerSideBar';
import { MANAGER_BASE_PATH } from './MANAGER_MENU';
import MobileManagerNav from './MobileManagerNav';
import {
  PageDescriptionBar,
  PageDescriptionProvider,
} from '../../common/PageDescriptionSlot';

const EXCLUDED = [
  // Company setup wizard and its loading/offline/error screens: the dashboard
  // URL shows these until setup is finished, and they are full-screen flows.
  ({ pathname, setupComplete }) =>
    pathname.replace(/\/+$/, '') === MANAGER_BASE_PATH &&
    setupComplete !== true,
];

// Frame for every page under /pages/account/manager (managers only),
// laid out like the admin frame: the green sidebar (md and up) or the bottom tab bar (phones),
// the header at the top of <main>, and the page description bar under it.
const ManagerShell = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname() || '';
  const { setupComplete } = useSetup();

  const showMenus =
    !isLoading &&
    user?.role === 'manager' &&
    !EXCLUDED.some((rule) => rule({ pathname, setupComplete }));

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated)
      window.location.href = '/pages/splash/splash3';
  }, [isLoading, isAuthenticated]);

  if (isLoading || !user) return <div className="p-6 text-sm">Loading…</div>;

  // Managers only: admins have their own pages. The frame (header, menus) shows for managers;
  // each page checks PageAccessRequirement('manager', '') and shows everyone else the
  // "no permission" screen with a way back to their own home.
  const isManager = user.role === 'manager';

  return (
    <PageDescriptionProvider>
      <div className="flex flex-row h-dvh w-full overflow-hidden bg-background-1">
        {showMenus && (
          <div className="hidden md:block h-full shrink-0">
            <ManagerSideBar />
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <main
            id="manager-main"
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar"
          >
            {/* the header stays at the top while the page scrolls under it */}
            {isManager && (
              <div className="sticky top-0 z-[60]">
                <ManagerHeader />
              </div>
            )}
            {children}
          </main>
          <PageDescriptionBar />
          {showMenus && <MobileManagerNav />}
        </div>
      </div>
    </PageDescriptionProvider>
  );
};

export default ManagerShell;
