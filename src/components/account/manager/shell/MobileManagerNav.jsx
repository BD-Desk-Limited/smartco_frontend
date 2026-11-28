import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import {
  MANAGER_MENU,
  managerMenuHref,
  managerMenuNameForPath,
} from './MANAGER_MENU';

// Phone navigation (below md): a bottom tab bar with the manager's pages.
const MobileManagerNav = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const activeMenu = managerMenuNameForPath(pathname);

  if (!user) return null;

  return (
    <nav
      aria-label="Main menu"
      // no z-index on purpose: page overlays (modals) paint over this bar
      className="md:hidden shrink-0 bg-brand-green text-text-white border-t border-green-shadow1 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex flex-row justify-around items-stretch">
        {MANAGER_MENU.filter((m) => m.mobileTab).map((menu) => {
          const active = activeMenu === menu.name;
          const Icon = active ? menu.ActiveIcon : menu.Icon;
          return (
            <li key={menu.name} className="flex-1">
              <button
                type="button"
                onClick={() => router.push(managerMenuHref(menu))}
                aria-current={active ? 'page' : undefined}
                className={`w-full h-14 flex flex-col items-center justify-center gap-1 text-xs ${active ? 'bg-white text-brand-green font-semibold' : 'text-text-white'}`}
              >
                <Icon className="text-lg" />
                <span>{menu.shortLabel || menu.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileManagerNav;
