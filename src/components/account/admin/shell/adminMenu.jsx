import {
  FaChartBar,
  FaUsers,
  FaAddressBook,
  FaPercent,
  FaShoppingBag,
  FaBoxes,
  FaHome,
  FaShippingFast,
  FaWindows,
  FaChartLine,
  FaExchangeAlt,
} from 'react-icons/fa';

export const ADMIN_BASE_PATH = '/pages/account/admin';

// One list for the desktop sidebar and the mobile bottom bar / "More" sheet.
// `link` is relative to ADMIN_BASE_PATH. `mobileTab` marks the items that get
// their own slot in the phone bottom bar; everything else lives under "More".
export const ADMIN_MENU = [
  {
    name: 'dashboard',
    Icon: FaWindows,
    ActiveIcon: FaWindows,
    link: '/',
    label: 'Dashboard',
    shortLabel: 'Home',
    requiredAccess: null,
    mobileTab: true,
  },
  {
    name: 'reports',
    Icon: FaChartBar,
    ActiveIcon: FaChartLine,
    link: '/reports',
    label: 'Reports',
    requiredAccess: 'Reports',
    mobileTab: true,
  },
  {
    name: 'purchases-and-supply',
    Icon: FaShippingFast,
    ActiveIcon: FaShippingFast,
    link: '/purchases',
    label: 'Purchases and Supply',
    shortLabel: 'Purchases',
    requiredAccess: '',
    mobileTab: true,
  },
  {
    name: 'inter-branch-transfers',
    Icon: FaExchangeAlt,
    ActiveIcon: FaExchangeAlt,
    link: '/inter-branch-transfers',
    label: 'Inter-Branch Transfers',
    shortLabel: 'Transfers',
    requiredAccess: '',
    mobileTab: true,
  },
  {
    name: 'my-customers',
    Icon: FaAddressBook,
    ActiveIcon: FaAddressBook,
    link: '/my-customers',
    label: 'My Customers',
    requiredAccess: 'Customer_Management',
  },
  {
    name: 'my-products',
    Icon: FaShoppingBag,
    ActiveIcon: FaShoppingBag,
    link: '/product-management',
    label: 'My Products',
    requiredAccess: 'Product_Management',
  },
  {
    name: 'materials-management',
    Icon: FaBoxes,
    ActiveIcon: FaBoxes,
    link: '/manage-materials',
    label: 'Manage Materials',
    requiredAccess: 'Materials_Management',
  },
  {
    name: 'users-management',
    Icon: FaUsers,
    ActiveIcon: FaUsers,
    link: '/users-management',
    label: 'Users Management',
    requiredAccess: 'Users_Management',
  },
  {
    name: 'tax-management',
    Icon: FaPercent,
    ActiveIcon: FaPercent,
    link: '/tax-management',
    label: 'Tax Management',
  },
  {
    name: 'branch-management',
    Icon: FaHome,
    ActiveIcon: FaHome,
    link: '/branch-management',
    label: 'Branch Management',
    requiredAccess: 'Branch_Management',
  },
];

export const menuHref = (menu) =>
  `${ADMIN_BASE_PATH}${menu.link === '/' ? '' : menu.link}`;

// Which menu item a URL belongs to, e.g. /pages/account/admin/manage-materials/edit-material
// -> 'materials-management'. Returns null for pages with no menu item (My Profile).
export const menuNameForPath = (pathname = '') => {
  const rest = pathname.replace(ADMIN_BASE_PATH, '').replace(/\/+$/, '');
  if (rest === '') return 'dashboard';
  const match = ADMIN_MENU.find(
    (menu) =>
      menu.link !== '/' &&
      (rest === menu.link || rest.startsWith(`${menu.link}/`))
  );
  return match ? match.name : null;
};

// Same rules the sidebar has always used: admin role, plus the menu's access
// level (or super admin / All_Access). Items with no requiredAccess show for
// admins who have at least one access level granted.
export const canSeeMenu = (user, menu) => {
  if (!user || user.role !== 'admin') return false;
  if (menu.superAdminOnly && !user.superAdmin) return false;
  if (menu.nonSuperAdminOnly && user.superAdmin) return false;

  const granted = (user.accessLevel || []).filter((a) => a.accessGranted);
  return (
    granted.some(
      (a) => !menu.requiredAccess || a.accessName === menu.requiredAccess
    ) ||
    user.superAdmin ||
    (user.accessLevel || []).some((a) => a.accessName === 'All_Access')
  );
};

export const userRoleLabel = (user) => {
  if (user?.superAdmin) return 'Super Admin';
  if (user?.role) return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  return '';
};
