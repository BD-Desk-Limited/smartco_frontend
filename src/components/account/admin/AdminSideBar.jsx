import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import Spinner from '../Spinner';
import {
  FaChartBar,
  FaUsers,
  FaAddressBook,
  FaPercent,
  FaShoppingBag,
  FaBoxes,
  FaChevronRight,
  FaChevronLeft,
  FaHome,
  FaShippingFast,
  FaWindows,
  FaChartLine,
  FaExchangeAlt,
} from 'react-icons/fa';

// Small pause before collapsing, so brushing the mouse past the edge doesn't make it flicker.
const CLOSE_DELAY_MS = 150;

const AdminSideBar = ({ selectedMenu, openSideBar }) => {
  // isOpen drives the width (animated). showLabels stays true until the panel has
  // finished closing, so the labels slide away with it instead of vanishing first.
  const [isOpen, setIsOpen] = useState(openSideBar || false);
  const [showLabels, setShowLabels] = useState(openSideBar || false);
  const closeTimer = React.useRef(null);

  const openPanel = () => {
    clearTimeout(closeTimer.current);
    setShowLabels(true);
    setIsOpen(true);
  };
  const closePanel = () => setIsOpen(false);

  // Expands while the mouse is over it, collapses when the mouse leaves.
  const handleMouseEnter = openPanel;
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
  const { user, logOut, isLoading } = useAuth();
  const [userRole, setUserRole] = useState('');

  const menuList = [
    {
      name: 'dashboard',
      icon: <FaWindows className="text-text-white" />,
      iconActive: <FaWindows className="text-brand-blue" />,
      link: '/',
      label: 'Dashboard',
      requiredAccess: null,
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'reports',
      icon: <FaChartBar className="text-text-white" />,
      iconActive: <FaChartLine className="text-brand-blue" />,
      link: '/reports',
      label: 'Reports',
      requiredAccess: 'Reports',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'purchases-and-supply',
      icon: <FaShippingFast className="text-text-white" />,
      iconActive: <FaShippingFast className="text-brand-blue" />,
      link: '/purchases',
      label: 'Purchases and Supply',
      requiredAccess: '',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'inter-branch-transfers',
      icon: <FaExchangeAlt className="text-text-white" />,
      iconActive: <FaExchangeAlt className="text-brand-blue" />,
      link: '/inter-branch-transfers',
      label: 'Inter-Branch Transfers',
      requiredAccess: '',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'my-customers',
      icon: <FaAddressBook className="text-text-white" />,
      iconActive: <FaAddressBook className="text-brand-blue" />,
      link: '/my-customers',
      label: 'My Customers',
      requiredAccess: 'Customer_Management',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'my-products',
      icon: <FaShoppingBag className="text-text-white" />,
      iconActive: <FaShoppingBag className="text-brand-blue" />,
      link: '/product-management',
      label: 'My Products',
      requiredAccess: 'Product_Management',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'materials-management',
      icon: <FaBoxes className="text-text-white" />,
      iconActive: <FaBoxes className="text-brand-blue" />,
      link: '/manage-materials',
      label: 'Manage Materials',
      requiredAccess: 'Materials_Management',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'users-management',
      icon: <FaUsers className="text-text-white" />,
      iconActive: <FaUsers className="text-brand-blue" />,
      link: '/users-management',
      label: 'Users Management',
      requiredAccess: 'Users_Management',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    /*{
      
      name: 'my-team',
      icon: <FaUserAltSlash className="text-text-white" />,
      iconActive: <FaUserAltSlash className="text-brand-blue" />,
      link: '/my-team',
      label: 'My Team',
      requiredAccess: 'Team_Management',
      superAdminOnly: false,
      nonSuperAdminOnly: true,
    
    },*/
    {
      name: 'tax-management',
      icon: <FaPercent className="text-text-white" />,
      iconActive: <FaPercent className="text-brand-blue" />,
      link: '/tax-management',
      label: 'Tax Management',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
    {
      name: 'branch-management',
      icon: <FaHome className="text-text-white" />,
      iconActive: <FaHome className="text-brand-blue" />,
      link: '/branch-management',
      label: 'Branch Management',
      requiredAccess: 'Branch_Management',
      superAdminOnly: false,
      nonSuperAdminOnly: false,
    },
  ];

  React.useEffect(() => {
    if (user?.superAdmin) {
      setUserRole('Super Admin');
    } else if (user?.role) {
      // Capitalize the first letter of the user's role
      setUserRole(user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1));
    }
  }, [user]);

  const router = useRouter();
  const handleMenuClick = (menu) => {
    router.push(`/pages/account/admin${menu.link}`);
  };

  const hasAccessToMenu = (menu) => {
    // Check if the user meets the conditions to access the menu
    const requiredRole = 'admin';
    const allActiveUserAccess =
      (user?.accessLevel.length > 0 &&
        user?.accessLevel.filter((access) => access.accessGranted === true)) ||
      [];

    const conditionsToShowMenu =
      user?.role === requiredRole &&
      (allActiveUserAccess.some(
        (access) =>
          access.accessName === menu?.requiredAccess || !menu?.requiredAccess
      ) || // Check if the user has the required access level
        user?.superAdmin || // Check if the user is a super admin
        user?.accessLevel.some((access) => access.accessName === 'All_Access')); // Check if the user has "All Access" permission

    // If the user is authenticated and meets the conditions to show the menu, return true
    if (user && conditionsToShowMenu) {
      return true;
    }
    // If the user does not meet the conditions, return false
    return false;
  };

  const hasRequiredRole = (menu) => {
    const requiredRole = 'admin';
    const requiresSuperAdmin = menu?.superAdminOnly === true;
    const forNonSuperAdmin = menu?.nonSuperAdminOnly === true;

    if (user?.role !== requiredRole) {
      return false;
    }

    if (requiresSuperAdmin && !user?.superAdmin) {
      return false;
    }

    if (forNonSuperAdmin && user?.superAdmin) {
      return false;
    }

    return true;
  };

  if (!user || isLoading) {
    return <Spinner />;
  }

  return (
    // The outer box always keeps the collapsed width (w-16), so the page never shifts.
    // The panel inside widens over the page content while hovered.
    <div className="relative w-16 h-screen shrink-0">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTransitionEnd={handleTransitionEnd}
        // 950ms width animation: draws out from / back into the left edge.
        // whitespace-nowrap keeps labels on one line while the panel is still narrow.
        className={`bg-brand-blue h-screen flex flex-col justify-center items-center absolute inset-y-0 left-0 z-[70] overflow-hidden whitespace-nowrap transition-[width,box-shadow] duration-[500ms] ease-in-out ${isOpen ? 'w-48 shadow-xl' : 'w-16'}`}
      >
        {/* Click toggles too, for touch screens where there is no hover */}
        <div
          onClick={() => (isOpen ? closePanel() : openPanel())}
          className="flex justify-between items-center px-4 pt-5 pb-16 gap-2 cursor-pointer"
        >
          <div className="flex flex-row justify-center items-center">
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
          </div>
          {!isOpen ? (
            <FaChevronRight className="text-white" />
          ) : (
            <FaChevronLeft className="text-white" />
          )}
        </div>

        {/* Render the menu items */}
        <div className="h-full flex flex-col justify-between w-full text-text-white">
          <div className="flex flex-col gap-1">
            {menuList.map((menu, index) => (
              <div
                key={index}
                className={`text-base gap-0 hover:bg-brand-green hover:text-white cursor-pointer my-0 rounded-md mx-1 px-1 ${showLabels ? '' : 'flex justify-center items-center'} ${selectedMenu === menu.name ? 'bg-white text-brand-blue' : ''}`}
                onClick={() => handleMenuClick(menu)}
              >
                {hasAccessToMenu(menu) && hasRequiredRole(menu) ? (
                  <div
                    className="flex flex-row items-center  py-2"
                    title={!showLabels ? `${menu?.label}` : ''}
                  >
                    {selectedMenu === menu.name ? menu.iconActive : menu.icon}
                    {showLabels && (
                      <p className="ml-2 text-sm">{menu?.label}</p>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* footer section */}
          <div className="flex flex-col gap-5 py-5 mx-5 border-t border-text-white justify-between">
            <div className="flex flex-col gap-2">
              <div
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
                {showLabels && <p className="text-sm">Logout</p>}
              </div>
              {user?.superAdmin && (
                <div
                  className="flex flex-row items-center gap-1 cursor-pointer hover:bg-error hover:text-text-white rounded-md py-2"
                  title={!showLabels ? 'deactivavte account' : ''}
                >
                  <Image
                    src="/assets/toggle-off.png"
                    alt="help"
                    width={20}
                    height={15}
                  />
                  {showLabels && <p className="text-sm">Deactivate Account</p>}
                </div>
              )}
            </div>
            <div>
              <div
                className={`flex ${showLabels ? ' flex-row gap-3' : 'flex-col gap-1'} items-center py-2 w-full text-center text-white bg-blue-shadow4 justify-center rounded-full`}
              >
                <Image
                  src="/assets/profile.png"
                  alt="profile"
                  width={20}
                  height={15}
                />
                <p className="text-sm">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
