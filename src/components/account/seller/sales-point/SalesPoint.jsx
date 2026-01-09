import React from 'react';
import HeadBar from './HeadBar';
import Footer from './Footer';

const SalesPoint = ({
  mode,
  setMode,
  menuItems,
  activeMenuItem,
  setActiveMenuItem,
  lightThemeStyle,
  darkThemeStyle,
}) => {
  return (
    <div className="h-screen flex flex-col justify-between items-center relative">
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />
      <Footer
        mode={mode}
        setMode={setMode}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />
    </div>
  );
};

export default SalesPoint;
