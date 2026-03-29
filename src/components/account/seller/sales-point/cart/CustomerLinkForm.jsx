import React from 'react';
import { FaSearch, FaBarcode } from 'react-icons/fa';

const CustomerLinkForm = ({
  handleCustomerSearch,
  customerSearchTerm,
  setCustomerSearchTerm,
  setScanMode,
  searchCustomerRef,
  mode,
  lightThemeStyle,
  darkThemeStyle,
  handleOpenOverlayForScanning,
}) => {
  return (
    <form
      onSubmit={handleCustomerSearch}
      className="p-2 border-b border-gray-border w-full flex flex-row gap-5 items-center sticky top-0 z-10 bg-opacity-95 backdrop-blur-lg"
    >
      <div className="flex flex-col font-semibold">
        <span>Link a customer to this order</span>
        <p className={`w-full flex flex-row items-center py-1`}>
          <input
            type="text"
            value={customerSearchTerm}
            onChange={(e) => setCustomerSearchTerm(e.target.value)}
            onFocus={() => setScanMode(false)}
            onBlur={(e) => {
              if (!e.currentTarget.form?.contains(e.relatedTarget)) {
                setScanMode(true);
              }
            }}
            ref={searchCustomerRef}
            placeholder="Search customer ID, name or email..."
            className={`w-80 bg-inherit p-2 border border-gray-border rounded-md outline-none focus:ring-2 focus:ring-brand-green`}
          />
          <button
            type="submit"
            className="bg-gray-shadow6 rounded-md p-3 ml-2 flex items-center justify-center hover:bg-gray-shadow5 transition-colors duration-200"
          >
            <FaSearch className="text-lg" />
          </button>
        </p>
      </div>
      <span>or</span>
      {/* scan customer card button */}
      <button
        type="submit"
        className={`p-2 border border-gray-border rounded-md ${mode === 'light' ? lightThemeStyle : darkThemeStyle} hover:bg-gray-shadow8 transition-colors duration-200 flex flex-col items-center justify-center`}
        onClick={handleOpenOverlayForScanning}
      >
        <span className="flex flex-row items-center gap-1 mb-1 scale-105 w-full justify-center">
          <FaBarcode className="text-lg" />
          <FaBarcode className="text-lg" />
          <FaBarcode className="text-lg" />
          <FaBarcode className="text-lg" />
        </span>
        <span className="text-text-gray font-semi-bold">
          Scan customer card
        </span>
      </button>
    </form>
  );
};

export default CustomerLinkForm;
