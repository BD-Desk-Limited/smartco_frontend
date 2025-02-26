import React, { use } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';

const AdminSideBar = ({ selectedMenu }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logOut } = useAuth();
  const [userRole, setUserRole] = useState('');

  const menuList = [
    {
      name: 'Dashboard',
      icon: '/assets/dashboard.png',
      iconActive: '/assets/dashboard_active.png',
      link: '/',
      title: 'Dashboard',
    },
    {
      name: 'Store Management',
      icon: '/assets/store.png',
      iconActive: '/assets/store_active.png',
      link: '/store-management',
      title: 'Store Management',
    },
    {
      name: 'Product Management',
      icon: '/assets/product.png',
      iconActive: '/assets/product_active.png',
      link: '/product-management',
      title: 'Product Management',
    },
    {
      name: 'Manage Materials',
      icon: '/assets/material.png',
      iconActive: '/assets/material_active.png',
      link: '/manage-materials',
      title: 'Manage Materials',
    },
    {
      name: 'Reports',
      icon: '/assets/report_white.png',
      iconActive: '/assets/report_active.png',
      link: '/reports',
      title: 'Reports',
    },
    {
      name: 'Notifications',
      icon: '/assets/notification.png',
      iconActive: '/assets/notification_active.png',
      link: '/notifications',
      title: 'Notifications',
    },
    {
      name: 'My Profile',
      icon: '/assets/profile.png',
      iconActive: '/assets/profile_active.png',
      link: '/my-profile',
      title: 'My Profile',
    },
    {
      name: 'Settings',
      icon: '/assets/settings.png',
      iconActive: '/assets/settings_active.png',
      link: '/settings',
      title: 'Settings',
    },
  ];

  React.useEffect(() => {
    if (user?.superAdmin) {
      setUserRole('Super Admin');
    } else if (user?.admin) {
      setUserRole(user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1));
    }
  }, [user]);

  const handleMenuClick = (menu) => {
    window.location.href = `/pages/account/admin${menu.link}`;
  };

  return (
    <div
      className={`bg-brand-blue h-screen flex flex-col ${isOpen ? 'w-48' : 'w-20'}`}
    >
      <div className="flex justify-between items-center px-4 pt-5 pb-16">
        <div className="flex flex-row justify-center items-center">
          <Image
            src={'/assets/logo_white.png'}
            alt="logo"
            width={30}
            height={30}
          />
          {isOpen && (
            <Image
              src={'/assets/logo_long.png'}
              alt="logo"
              width={80}
              height={20}
            />
          )}
        </div>
        <p onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          <Image
            src={isOpen ? '/assets/arrow_left.png' : '/assets/arrow_right.png'}
            alt="close"
            width={10}
            height={10}
          />
        </p>
      </div>
      <div className="h-full flex flex-col justify-between w-full text-text-white">
        <div className="flex flex-col gap-1">
          {menuList.map((menu, index) => (
            <div
              key={index}
              className={`text-base py-2 gap-0 m-0 hover:bg-white hover:text-brand-blue cursor-pointer my-0 rounded-md mx-2 px-2 ${selectedMenu?.name === menu.name ? 'bg-white text-brand-blue' : ''}`}
              onClick={() => handleMenuClick(menu)}
            >
              <div
                className="flex flex-row items-center"
                title={!isOpen ? `${menu?.title}` : ''}
              >
                <Image
                  src={
                    selectedMenu?.name === menu.name
                      ? menu.iconActive
                      : menu.icon
                  }
                  alt={menu?.name}
                  width={15}
                  height={15}
                  className={
                    selectedMenu?.name === menu.name ? '' : 'bg-brand-blue'
                  }
                />
                {isOpen && <p className="ml-2 text-sm">{menu?.name}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 py-5 mx-5 border-t border-text-white justify-between">
          <div className="flex flex-col gap-2">
            <div
              className="flex flex-row items-center gap-1 cursor-pointer hover:bg-error hover:text-text-white rounded-md py-2"
              title={!isOpen ? 'Logout' : ''}
              onClick={logOut}
            >
              <Image
                src="/assets/logout.png"
                alt="logout"
                width={15}
                height={15}
              />
              {isOpen && <p className="text-sm">Logout</p>}
            </div>
            {user?.superAdmin && (
              <div
                className="flex flex-row items-center gap-1 cursor-pointer hover:bg-error hover:text-text-white rounded-md py-2"
                title={!isOpen ? 'deactivavte account' : ''}
              >
                <Image
                  src="/assets/toggle-off.png"
                  alt="help"
                  width={20}
                  height={15}
                />
                {isOpen && <p className="text-sm">Deactivate Account</p>}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-row items-center py-2 w-full text-center">
              <Image
                src="/assets/profile.png"
                alt="profile"
                width={20}
                height={15}
              />
              {isOpen && <p className="text-sm">{userRole}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
