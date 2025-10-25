import React from 'react';

const PageDescription = ({ pageDescription }) => {
  return (
    <div className="bg-white px-3 mx-5 mb-5 rounded-md italic text-text-gray max-h-20 overflow-y-auto scrollbar-thin relative">
      <h1 className="text-base font-semibold sticky top-0 pt-2 bg-white">Page description Panel</h1>
      <span className="text-sm font-thin">{pageDescription}</span>
    </div>
  );
};

export default PageDescription;
