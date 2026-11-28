import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';
import { usePathname, useRouter } from 'next/navigation';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import {
  ADMIN_MENU,
  canSeeMenu,
  menuHref,
  menuNameForPath,
  userRoleLabel,
} from './adminMenu';

// Small pause before collapsing, so brushing the mouse past the edge doesn't make it flicker.
const CLOSE_DELAY_MS = 150;

// Desktop/tablet sidebar (md and up). Rendered once by AdminShell in the admin
// layout; phones get MobileAdminNav instead. `selectedMenu` is optional: by
// default the active item comes from the URL.
const AdminSideBar = ({ selectedMenu, openSideBar }) => {
  // isOpen drives the width (animated). showLabels stays true until the panel has
  // finished closing, so the labels slide away with it instead of vanishing first.
  const [isOpen, setIsOpen] = useState(openSideBar || false);
  const [showLabels, setShowLabels] = useState(openSideBar || false);
  const closeTimer = React.useRef(null);
  const { user, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const activeMenu = selectedMenu || menuNameForPath(pathname);

  const openPanel = () => {
    clearTimeout(closeTimer.current);
    setShowLabels(true);
    setIsOpen(true);
  };
  const closePanel = () => setIsOpen(false);

  // Expands while the mouse is over it, collapses when the mouse leaves.
  const handleMouseLeave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(closePanel, CLOSE_DELAY_MS);
  };
  const handleTransitionEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === 'width' && !isOpen) {
      setShowLabels(false);
    }
  };
  React.useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (!user) return null;

  const visibleMenus = ADMIN_MENU.filter((menu) => canSeeMenu(user, menu));

  return (
    // The outer box always keeps the collapsed width (w-16), so the page never shifts.
    // The panel inside widens over the page content while hovered.
    <div className="relative w-16 h-full shrink-0">
      <nav
        aria-label="Main menu"
        onMouseEnter={openPanel}
        onMouseLeave={handleMouseLeave}
        onTransitionEnd={handleTransitionEnd}
        // whitespace-nowrap keeps labels on one line while the panel is still narrow.
        className={`bg-brand-blue h-full flex flex-col justify-center items-center absolute inset-y-0 left-0 z-[70] overflow-hidden whitespace-nowrap transition-[width,box-shadow] duration-[500ms] ease-in-out ${isOpen ? 'w-48 shadow-xl' : 'w-16'}`}
      >
        {/* Click toggles too, for touch screens where there is no hover */}
        <button
          type="button"
          onClick={() => (isOpen ? closePanel() : openPanel())}
          aria-label={isOpen ? 'Collapse menu' : 'Expand menu'}
          className="flex justify-between items-center px-4 pt-5 pb-16 gap-2 cursor-pointer"
        >
          <span className="flex flex-row justify-center items-center">
            <Image
              src={'/assets/logo_white.png'}
              alt="logo"
              width={331}
              height={322}
              style={{ width: 30, height: 'auto' }}
            />
            {showLabels && (
              <Image
                src={'/assets/logo_long.png'}
                alt="logo"
                width={80}
                height={20}
              />
            )}
          </span>
          {!isOpen ? (
            <FaChevronRight className="text-white" />
          ) : (
            <FaChevronLeft className="text-white" />
          )}
        </button>

        <div className="h-full flex flex-col justify-between w-full text-text-white">
          <div className="flex flex-col gap-1">
            {visibleMenus.map((menu) => {
              const active = activeMenu === menu.name;
              const Icon = active ? menu.ActiveIcon : menu.Icon;
              return (
                <button
                  type="button"
                  key={menu.name}
                  onClick={() => router.push(menuHref(menu))}
                  title={!showLabels ? menu.label : ''}
                  aria-current={active ? 'page' : undefined}
                  className={`text-base hover:bg-brand-green hover:text-white cursor-pointer rounded-md mx-1 px-1 py-2 flex flex-row items-center ${showLabels ? '' : 'justify-center'} ${active ? 'bg-white text-brand-blue' : ''}`}
                >
                  <Icon
                    className={active ? 'text-brand-blue' : 'text-text-white'}
                  />
                  {showLabels && (
                    <span className="ml-2 text-sm">{menu.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* footer section */}
          <div className="flex flex-col gap-5 py-5 mx-5 border-t border-text-white justify-between">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex flex-row items-center gap-1 cursor-pointer hover:bg-error hover:text-text-white rounded-md py-2"
                title={!showLabels ? 'Logout' : ''}
                onClick={logOut}
              >
                <Image
                  src="/assets/logout.png"
                  alt="logout"
                  width={15}
                  height={15}
                />
                {showLabels && <span className="text-sm">Logout</span>}
              </button>
              {user?.superAdmin && (
                <div
                  className="flex flex-row items-center gap-1 cursor-pointer hover:bg-error hover:text-text-white rounded-md py-2"
                  title={!showLabels ? 'Deactivate account' : ''}
                >
                  <Image
                    src="/assets/toggle-off.png"
                    alt="deactivate"
                    width={20}
                    height={15}
                  />
                  {showLabels && <p className="text-sm">Deactivate Account</p>}
                </div>
              )}
            </div>
            <div
              className={`flex ${showLabels ? ' flex-row gap-3' : 'flex-col gap-1'} items-center py-2 w-full text-center text-white bg-blue-shadow4 justify-center rounded-full`}
            >
              <Image
                src="/assets/profile.png"
                alt="profile"
                width={20}
                height={15}
              />
              <p className="text-sm">{userRoleLabel(user)}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminSideBar;
