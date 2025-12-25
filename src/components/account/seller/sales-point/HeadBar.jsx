import Image from 'next/image';
import React from 'react';
import { useAuth } from '@/contexts/authContext';

const HeadBar = ({
  mode,
  darkThemeStyle,
  lightThemeStyle,
  menuItems,
  activeMenuItem,
  setActiveMenuItem,
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-brand-green flex items-center justify-between p-3 flex-row w-full px-10">
      <Image
        src="/assets/pos.png"
        alt="pos Logo"
        width={20}
        height={20}
        className="object-contain"
      />

      <div className="flex items-center space-x-2 text-lg">
        <Image
          src="/assets/logo_white.png"
          alt="pos Logo"
          width={40}
          height={40}
          className="object-contain"
        />

        <strong className="text-white">POS</strong>
      </div>

      <nav
        className={`rounded-xl ${mode === 'dark' ? darkThemeStyle : lightThemeStyle}`}
      >
        <ul className="flex space-x-6">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer font-bold flex items-center space-x-2 py-3 px-2${
                activeMenuItem === item.name
                  ? 'border border-2 border-brand-green text-brand-green px-2 rounded-md shadow-md'
                  : ''
              }`}
              onClick={() => setActiveMenuItem(item.name)}
            >
              {item.iconPath && (
                <Image
                  src={
                    activeMenuItem === item.name
                      ? item.iconPath.active
                      : mode === 'dark'
                        ? item.iconPath.light
                        : item.iconPath.dark
                  }
                  alt={`${item.name} icon`}
                  width={25}
                  height={25}
                />
              )}
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center space-x-4">
        <Image
          src={user?.profilePictureUrl || '/assets/user.png'}
          alt="User Avatar"
          width={40}
          height={40}
          className="object-contain rounded-full"
        />
        <span className="text-text-white text-sm font-semibold">
          {user?.fullName?.split(' ')[0] || 'Seller'}
        </span>
      </div>
    </div>
  );
};

export default HeadBar;
