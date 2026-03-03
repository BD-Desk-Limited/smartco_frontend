import React from 'react';
import HeadBar from './HeadBar';
import Footer from './Footer';
import SalesPointContent from './SalesPointContent';

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
    <div className="h-screen overflow-y-auto no-scrollbar flex flex-col items-center relative">
      <HeadBar
        mode={mode}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />
      <div className="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar w-full flex items-center justify-center relative">
        <SalesPointContent
          mode={mode}
          activeMenuItem={activeMenuItem}
          lightThemeStyle={lightThemeStyle}
          darkThemeStyle={darkThemeStyle}
        />
      </div>

      <Footer
        mode={mode}
        setMode={setMode}
        style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
      />
    </div>
  );
};

export default SalesPoint;
