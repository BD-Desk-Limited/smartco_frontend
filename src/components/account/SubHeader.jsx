import React from 'react';

const SubHeader = ({ title }) => {
  return (
    <div className="h-[5vh] flex justify-between w-full py-5 border-y-2 border-gray-border shadow-lg px-1 bg-text-white">
      <div className="font-bold flex justify-start items-center">{title}</div>
      <div className="flex justify-end items-center gap-5">
        
      </div>
    </div>
  );
};

export default SubHeader;
