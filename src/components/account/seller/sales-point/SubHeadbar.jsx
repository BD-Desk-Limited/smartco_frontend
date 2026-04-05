import React from 'react';
import { motion } from 'framer-motion';

const SubHeadbar = ({
  searchTerm,
  setSearchTerm,
  setScanMode,
  searchRef,
  filterValue,
  setFilterValue,
  filterRef,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  pendingOrders,
  setActiveMenuItem,
}) => {
  //mapping utility buttons to their respective actions, values and styles for easier management and scalability
  const utilityButtons = [
    {
      label: 'Pending Orders',
      onClick: () => setActiveMenuItem('pending-orders'),
      showBadge: pendingOrders?.length > 0,
      badgeContent: pendingOrders?.length,
      badgeStyle:
        'absolute -top-1 -right-2 bg-error text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center',
      buttonStyle:
        'px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/80 relative',
    },
    {
      label: 'Pending Registrations',
      onClick: () => setActiveMenuItem('pending-registrations'),
      showBadge: false,
      badgeContent: null,
      badgeStyle: '',
      buttonStyle:
        'px-4 py-2 bg-gray-200 text-text-black rounded-md hover:bg-gray-300',
    },
    {
      label: 'Order Schedule',
      onClick: () => setActiveMenuItem('order-schedule'),
      showBadge: false,
      badgeContent: null,
      badgeStyle: '',
      buttonStyle:
        'px-4 py-2 bg-gray-200 text-text-black rounded-md hover:bg-gray-300',
    },
  ];

  // mapping filter options for easier management and scalability
  const filterOptions = [
    'All Products',
    'in Stock',
    'out of Stock',
    'low stock',
    'discontinued',
  ];

  return (
    <div className="p-4 border-b border-gray-border w-full flex flex-row justify-between items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-lg">
      {/* Top Search and filter bar */}
      <div className="flex flex-row items-center">
        {/* Search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setScanMode(false)}
          onBlur={() => setScanMode(true)}
          ref={searchRef}
          placeholder="Search items name, category or description..."
          className={`w-80 p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
        />

        {/* Available products filter */}
        <select
          className={`ml-4 p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
          value={filterValue}
          ref={filterRef}
          onFocus={() => setScanMode(false)}
          onBlur={() => setScanMode(true)}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="All Products">All Products</option>
          {filterOptions.map((option) => (
            <option
              key={option}
              value={option}
              className={mode === 'light' ? lightThemeStyle : darkThemeStyle}
            >
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* action buttons */}
      <div className="inline-flex ml-4 space-x-2">
        {utilityButtons.map((button) => (
          <button
            key={button.label}
            className={button.buttonStyle}
            onClick={button.onClick}
          >
            <span>{button.label}</span>
            {/* Badge */}
            {button.showBadge && (
              <motion.div
                className={`${button.badgeStyle}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {button.badgeContent}
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubHeadbar;
