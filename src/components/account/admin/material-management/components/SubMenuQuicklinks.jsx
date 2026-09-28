import { useRouter } from 'next/navigation';
import React from 'react';

const SubMenuQuickLinks = ({ currentPageLabel, otherLinks }) => {
  const Router = useRouter();
  return (
    <div className="flex flex-row items-center h-full text-sm gap-2">
      <span className="text-text-blue font-semibold">{currentPageLabel}</span> |
      {otherLinks.map((l, idx) => (
        <span
          key={idx}
          onClick={() => Router.push(l.link)}
          className="hover:underline cursor-pointer"
        >
          {l.label}
        </span>
      ))}
    </div>
  );
};

export default SubMenuQuickLinks;
