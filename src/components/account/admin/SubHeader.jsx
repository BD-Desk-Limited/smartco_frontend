import React from 'react';

const SubHeader = ({ FirstComponents, title, ExtraComponents }) => {
  return (
    <div className="h-[5vh] flex flex-row items-center w-full py-5 border-y-2 border-gray-border shadow-lg px-1 bg-text-white">
      <div>{FirstComponents || null}</div>
      <div className="font-bold flex justify-start items-center text-text-gray">
        {title}
      </div>
      <div>{ExtraComponents || null}</div>
      <div className="flex justify-end items-center gap-5"></div>
    </div>
  );
};

export default SubHeader;
