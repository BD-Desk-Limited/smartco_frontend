import React from 'react';
import { FaReply } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  return (
    <div className="h-[5vh] flex justify-end items-center gap-5 w-full py-7 bg-text-white relative">
      {/* floating back button */}
      <span
        onClick={() => router.back()}
        title="Back to previous page"
        className="bg-text-white
        p-2 shadow-sm
        rounded-l-xl absolute left-2 cursor-pointer hover:bg-gray-border text-base text-brand-blue flex flex-row gap-2"
      >
        <FaReply className="" />
        <span>Back</span>
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
