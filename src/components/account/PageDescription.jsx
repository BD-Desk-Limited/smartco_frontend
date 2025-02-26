import React from 'react';

const PageDescription = ({ pageDescription }) => {
  return (
    <div className="bg-white p-3 mx-5 mb-5 rounded-md italic text-text-gray max-h-20 overflow-y-auto scrollbar-thin">
      <h1 className="text-base font-semibold">Page description Panel</h1>
      <span className="text-sm font-thin">{pageDescription}</span>
    </div>
  );
};

export default PageDescription;
