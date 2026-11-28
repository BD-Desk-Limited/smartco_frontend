'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { useSetup } from '@/contexts/setupContext';
import AdminSideBar from './AdminSideBar';
import MobileAdminNav from './MobileAdminNav';
import { ADMIN_BASE_PATH } from './adminMenu';
import {
  PageDescriptionBar,
  PageDescriptionProvider,
} from '../../common/PageDescriptionSlot';

// Admin pages that must render on their own, without the menus.
// Each entry gets the pathname; return true to leave the page bare.
const EXCLUDED = [
  // Company setup wizard and its loading/offline/error screens: the dashboard
  // URL shows these until setup is finished, and they are full-screen flows.
  ({ pathname, setupComplete }) =>
    pathname.replace(/\/+$/, '') === ADMIN_BASE_PATH && setupComplete !== true,
];

// Frame for every page under /pages/account/admin:
// - md and up: the collapsible blue sidebar on the left
// - phones: a bottom tab bar + "More" sheet
// The page itself scrolls inside <main>, so sticky headers stick to the top of it.
// Under <main> (never over it): the page description bar (md and up) and the
// phone bottom bar, so nothing in the page can end up hidden behind them.
//
// Pages are always rendered in the same spot in the tree, whether or not the
// menus show, so they are never remounted when auth/setup finishes loading.
const AdminShell = ({ children }) => {
  const pathname = usePathname() || '';
  const { user, isLoading } = useAuth();
  const { setupComplete } = useSetup();

  const showMenus =
    !isLoading &&
    user?.role === 'admin' && // non-admins get the page's own "no access" screen
    !EXCLUDED.some((rule) => rule({ pathname, setupComplete }));

  return (
    <PageDescriptionProvider>
      <div className="flex flex-row h-dvh w-full overflow-hidden bg-background-1">
        {showMenus && (
          <div className="hidden md:block h-full shrink-0">
            <AdminSideBar />
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <main
            id="admin-main"
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar"
          >
            {children}
          </main>
          <PageDescriptionBar />
          {showMenus && <MobileAdminNav />}
        </div>
      </div>
    </PageDescriptionProvider>
  );
};

export default AdminShell;
