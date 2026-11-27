import React, { useState } from 'react';
import useEscapeToClose from '../ui/useEscapeToClose';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/contexts/authContext';
import {
  ADMIN_BASE_PATH,
  ADMIN_MENU,
  canSeeMenu,
  menuHref,
  menuNameForPath,
  userRoleLabel,
} from './adminMenu';

// Phone navigation (below md): a bottom tab bar for the screens used on the move,
// and a "More" sheet with every other section, My Profile and Logout.
const MobileAdminNav = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeMenu = menuNameForPath(pathname);

  // (navigating from the sheet goes through go(), which closes it)
  useEscapeToClose(() => setMoreOpen(false), moreOpen);

  if (!user) return null;

  const visible = ADMIN_MENU.filter((menu) => canSeeMenu(user, menu));
  const tabs = visible.filter((menu) => menu.mobileTab);
  const moreItems = visible.filter((menu) => !menu.mobileTab);
  const onProfile = pathname.startsWith(`${ADMIN_BASE_PATH}/my-profile`);
  const moreActive =
    moreOpen || onProfile || moreItems.some((m) => m.name === activeMenu);

  const go = (href) => {
    setMoreOpen(false);
    router.push(href);
  };

  return (
    <>
      <nav
        aria-label="Main menu"
        // no z-index on purpose: page overlays (side views, modals) are positioned,
        // so they all paint over this bar, whatever their z-index
        className="md:hidden shrink-0 bg-brand-blue text-text-white border-t border-blue-shadow2 pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="flex flex-row justify-around items-stretch">
          {tabs.map((menu) => {
            const active = activeMenu === menu.name && !moreOpen;
            const Icon = active ? menu.ActiveIcon : menu.Icon;
            return (
              <li key={menu.name} className="flex-1">
                <button
                  type="button"
                  onClick={() => go(menuHref(menu))}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full h-14 flex flex-col items-center justify-center gap-1 text-xs ${active ? 'text-green-shadow5' : 'text-text-white'}`}
                >
                  <Icon className="text-lg" />
                  <span>{menu.shortLabel || menu.label}</span>
                </button>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              aria-controls="admin-more-sheet"
              className={`w-full h-14 flex flex-col items-center justify-center gap-1 text-xs ${moreActive ? 'text-green-shadow5' : 'text-text-white'}`}
            >
              {moreOpen ? (
                <FaTimes className="text-lg" />
              ) : (
                <FaBars className="text-lg" />
              )}
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen && (
        <div
          // stops above the bottom bar, so the bar stays visible and tappable
          className="md:hidden fixed inset-x-0 top-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-[64] bg-black bg-opacity-50 flex items-end"
          onClick={() => setMoreOpen(false)}
        >
          <div
            id="admin-more-sheet"
            role="dialog"
            aria-label="More sections"
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-2xl shadow-xl max-h-[75dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <p className="font-semibold text-text-black">More</p>
              <span className="text-xs bg-blue-shadow10 text-brand-blue rounded-full px-3 py-1">
                {userRoleLabel(user)}
              </span>
            </div>

            <ul className="grid grid-cols-3 gap-2 px-3 pb-3">
              {moreItems.map((menu) => {
                const active = activeMenu === menu.name;
                const Icon = menu.Icon;
                return (
                  <li key={menu.name}>
                    <button
                      type="button"
                      onClick={() => go(menuHref(menu))}
                      aria-current={active ? 'page' : undefined}
                      className={`w-full min-h-20 rounded-xl flex flex-col items-center justify-center gap-2 px-1 py-3 text-xs text-center leading-tight ${active ? 'bg-brand-blue text-white' : 'bg-gray-shadow10 text-text-black'}`}
                    >
                      <Icon
                        className={`text-xl ${active ? 'text-white' : 'text-brand-blue'}`}
                      />
                      <span>{menu.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-gray-border px-3 py-2 flex flex-col">
              <button
                type="button"
                onClick={() => go(`${ADMIN_BASE_PATH}/my-profile`)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-black hover:bg-gray-shadow10"
              >
                <FaUserCircle className="text-lg text-brand-blue" />
                My Profile
              </button>
              <button
                type="button"
                onClick={logOut}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-error hover:bg-gray-shadow10"
              >
                <FaSignOutAlt className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileAdminNav;
