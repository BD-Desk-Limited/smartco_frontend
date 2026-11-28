import React from 'react';

const SubHeader = ({ FirstComponents, title, ExtraComponents }) => {
  return (
    <div className="min-h-10 flex flex-row flex-wrap items-center gap-x-2 gap-y-1 w-full py-2 md:py-3 border-y-2 border-gray-border shadow-lg px-2 md:px-1 bg-text-white">
      {FirstComponents ? (
        <div className="shrink-0">{FirstComponents}</div>
      ) : null}
      <div className="font-bold text-text-gray min-w-0 truncate">{title}</div>
      {ExtraComponents ? (
        <div className="min-w-0">{ExtraComponents}</div>
      ) : null}
    </div>
  );
};

export default SubHeader;
