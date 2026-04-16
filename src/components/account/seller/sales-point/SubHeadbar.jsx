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
  activeMenuItem,
}) => {
  //mapping utility buttons to their respective actions, values and styles for easier management and scalability
  const utilityButtons = [
    // Note: Do not change the keys as they are used to determine which content to show in the main area. for Consistency across the application, only change the label and onClick actions as needed.
    {
      label: 'Pending Orders',
      key: 'pending-orders',
      onClick: () => setActiveMenuItem('pending-orders'),
      showBadge: pendingOrders?.length > 0,
      badgeContent: pendingOrders?.length,
      badgeStyle:
        'absolute -top-1 -right-2 bg-error text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center',
    },
    {
      label: 'Pending Registrations',
      key: 'pending-registrations',
      onClick: () => {
        alert('This feature is not yet implemented. Try at a later time.');
      }, //setActiveMenuItem('pending-registrations'),
      showBadge: false,
      badgeContent: null,
      badgeStyle: '',
    },
    {
      label: 'Scheduled Orders',
      key: 'scheduled-orders',
      onClick: () => {
        alert('This feature is not yet implemented. Try at a later time.');
      }, //setActiveMenuItem('scheduled-orders'),
      showBadge: false,
      badgeContent: null,
      badgeStyle: '',
    },
  ];

  // mapping filter options for easier management and scalability
  const filterOptions = [
    { label: 'All Products', value: 'all products' },
    { label: 'In Stock', value: 'in stock' },
    { label: 'Out of Stock', value: 'out of stock' },
    { label: 'Low Stock', value: 'low stock' },
    { label: 'Discontinued', value: 'discontinued' },
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
          {filterOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className={mode === 'light' ? lightThemeStyle : darkThemeStyle}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* action buttons */}
      <div className="inline-flex ml-4 space-x-2">
        {utilityButtons.map((button) => (
          <button
            key={button.label}
            className={`
              px-2 py-2 rounded-md hover:border-brand-green hover:shadow-inner border-2 border-gray-border relative
              ${
                activeMenuItem === button.key ? 'bg-brand-green text-white' : ''
              } transition-colors duration-200
            `}
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
