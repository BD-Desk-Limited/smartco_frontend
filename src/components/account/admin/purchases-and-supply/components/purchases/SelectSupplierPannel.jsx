import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SelectSupplierPannel = () => {
  const [searchInput, setSearchInput] = useState('');
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="bg-white w-[80%] h-[90%] rounded-lg p-5"
    >
      {/* search bar */}
      <div className="h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full">
        <FaSearch className="text-text-gray" />
        <input
          type="text"
          placeholder="Search suppliers"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="focus:outline-none ml-2 w-full"
        />
      </div>
    </div>
  );
};

export default SelectSupplierPannel;
