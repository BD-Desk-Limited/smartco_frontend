import React from 'react';
import { FaStepBackward } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  return (
    <div className="h-[5vh] flex justify-end items-center gap-5 w-full py-7 bg-text-white relative">
      {/* floating back button */}
      <span
        onClick={() => router.back()}
        title="Back to previous page"
        className="bg-text-white border border-gray-border 
        p-2 shadow-md
        rounded-full absolute left-2 cursor-pointer hover:bg-gray-border"
      >
        <FaStepBackward className="text-lg text-brand-blue" />
      </span>
      <div>Searchbar</div>
      <div className="flex flex-row justify-between items-center gap-5">
        <p>notification bell</p>
        <p>profile pic</p>
        <p>name</p>
      </div>
    </div>
  );
};

export default Header;
