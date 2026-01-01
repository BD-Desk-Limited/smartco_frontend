import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ShiftManagementSidebar = ({ style, setMinimized }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: '80%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '80%' }}
      transition={{ duration: 0.35 }}
      className={`w-full h-full rounded-l-3xl overflow-x-hidden p-5 ${style} relative`}
    >
      <div className="h-full w-full">
        <h2 className="text-base font-semibold text-brand-green">
          Shift Management
        </h2>
        <hr className="my-1 border-brand-green" />
      </div>

      {/* Sidebar collapse button */}
      <span
        onClick={() => setMinimized(true)}
        className="absolute top-[50%] left-[-5px] cursor-pointer text-2xl font-bold"
      >
        <Image
          src="/assets/close-icon.png"
          alt="Close"
          width={40}
          height={40}
        />
      </span>
    </motion.div>
  );
};

export default ShiftManagementSidebar;
