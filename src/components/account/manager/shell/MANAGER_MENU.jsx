import { FaWindows, FaMoneyCheckAlt, FaDatabase } from 'react-icons/fa';

export const MANAGER_BASE_PATH = '/pages/account/manager';

// The manager's pages: one list for the desktop sidebar and the phone bottom bar.
// `link` is relative to MANAGER_BASE_PATH. A manager has no access levels of their own: what they see
// comes from manager routes on the server, scoped to the branches they are assigned to.
export const MANAGER_MENU = [
  {
    name: 'dashboard',
    Icon: FaWindows,
    ActiveIcon: FaWindows,
    link: '',
    label: 'Dashboard',
    shortLabel: 'Home',
    mobileTab: true,
  },
  {
    name: 'cash-reconciliation',
    Icon: FaMoneyCheckAlt,
    ActiveIcon: FaMoneyCheckAlt,
    link: '/cash-reconciliation',
    label: 'Cash reconciliation',
    shortLabel: 'Banking',
    mobileTab: true,
    description:
      'Declare what was banked each day, with proof of payment, for finance to approve.',
  },
  {
    name: 'local-data-management',
    Icon: FaDatabase,
    ActiveIcon: FaDatabase,
    link: '/local-data-management',
    label: 'Unsynced data',
    shortLabel: 'Unsynced',
    mobileTab: true,
    description:
      'Sales and products saved on this device that have not synced yet.',
  },
];

export const managerMenuHref = (menu) => `${MANAGER_BASE_PATH}${menu.link}`;

// which menu item a URL belongs to (null for pages with no menu item)
export const managerMenuNameForPath = (pathname = '') => {
  const rest = pathname.replace(MANAGER_BASE_PATH, '').replace(/\/+$/, '');
  if (rest === '') return 'dashboard';
  const match = MANAGER_MENU.find(
    (menu) =>
      menu.link && (rest === menu.link || rest.startsWith(`${menu.link}/`))
  );
  return match ? match.name : null;
};

export const managerRoleLabel = (user) => {
  if (user?.superAdmin) return 'Super Admin';
  if (user?.role) return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  return '';
};
