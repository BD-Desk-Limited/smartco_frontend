import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/authContext';
import { motion } from 'framer-motion';

const HeadBar = ({
  style,
  menuItems,
  activeMenuItem,
  setActiveMenuItem,
  cart,
  mode,
}) => {
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const previousCartCountRef = useRef(0);

  useEffect(() => {
    const hasIncreased = cart?.items?.length > previousCartCountRef.current;

    if (!hasIncreased) {
      previousCartCountRef.current = cart?.items?.length;
      return;
    }

    const startTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 0);

    const stopTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);

    previousCartCountRef.current = cart?.items?.length;

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [cart?.items?.length]);

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

      <nav className={`rounded-xl ${style}`}>
        <ul className="flex space-x-6">
          {(menuItems || []).map((item) => (
            <motion.div
              animate={
                isAnimating && item.name === 'Cart'
                  ? {
                      scale: [1, 1.5, 0.9, 1.1, 1],
                      rotate: [0, -10, 10, -5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              key={item.name}
              className={`cursor-pointer font-bold flex items-center space-x-2 py-3 px-2 relative${
                activeMenuItem === item.name
                  ? 'border border-2 border-brand-green text-brand-green px-2 rounded-md shadow-md'
                  : ''
              }`}
              onClick={() => setActiveMenuItem(item.name)}
            >
              {item.iconPath && (
                <div>
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
                </div>
              )}
              <span>{item.name}</span>

              {/* Cart Badge */}
              {item.name === 'Cart' && cart?.items?.length > 0 && (
                <motion.div
                  className={`absolute -top-1 -right-2 bg-error text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cart?.items.length}
                >
                  {cart?.items.length}
                </motion.div>
              )}
            </motion.div>
          ))}
        </ul>
      </nav>

      <div className="flex items-center space-x-4">
        {user?.profilePictureUrl ? (
          <Image
            src={user?.profilePictureUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="object-contain rounded-full"
          />
        ) : (
          <span className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold border">
            {user?.fullName
              ? user.fullName?.split(' ')[0].charAt(0).toUpperCase() +
                  user.fullName?.split(' ')[1]?.charAt(0).toUpperCase() || 'SU'
              : 'SU'}
          </span>
        )}
        <span className="text-text-white text-sm font-semibold">
          {user?.fullName?.split(' ')[0] || 'Seller'}
        </span>
      </div>
    </div>
  );
};

export default HeadBar;
