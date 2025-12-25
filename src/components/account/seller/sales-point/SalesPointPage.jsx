import React from 'react';
import Button from '../../Button';
import { useCompanyData } from '@/contexts/companyDataContext';
import HeadBar from './HeadBar';
import Footer from './Footer';

const SalesPointPage = () => {
  const { companyData } = useCompanyData();
  const [mode, setMode] = React.useState('light');
  const [activeMenuItem, setActiveMenuItem] = React.useState('Dashboard');
  const menuItems = [
    {
      name: 'Dashboard',
      component: null,
      iconPath: {
        light: '/assets/window_white.png',
        dark: '/assets/window_dark.png',
        active: '/assets/window_green.png',
      },
    },
    {
      name: 'Cart',
      iconPath: {
        light: '/assets/cart_white.png',
        dark: '/assets/cart_dark.png',
        active: '/assets/cart_green.png',
      },
    },
    {
      name: 'Customers',
      iconPath: {
        light: '/assets/customers_white.png',
        dark: '/assets/customers_dark.png',
        active: '/assets/customers_green.png',
      },
    },
    {
      name: 'Payments',
      iconPath: {
        light: '/assets/card_white.png',
        dark: '/assets/card_dark.png',
        active: '/assets/card_green.png',
      },
    },
  ];

  const darkThemeStyle = `bg-black text-text-white`;
  const lightThemeStyle = `bg-white text-text-black`;

  return (
    <div className="h-screen flex flex-col justify-between items-center relative">
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        darkThemeStyle={darkThemeStyle}
        lightThemeStyle={lightThemeStyle}
      />
      <Footer
        mode={mode}
        setMode={setMode}
        darkThemeStyle={darkThemeStyle}
        lightThemeStyle={lightThemeStyle}
      />
    </div>
  );
};

export default SalesPointPage;
