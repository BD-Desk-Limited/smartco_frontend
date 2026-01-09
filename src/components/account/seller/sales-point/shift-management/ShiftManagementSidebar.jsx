import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ShiftManagementSidebar = ({ style, setMinimized }) => {
  {
    /*
  Workflow:
    //check if there is any active shift
    ----//if no active shift show a message telling the user there is no active shift and an exit button.
    //else
      check if user is logged into any shift
    ----if user is logged into a shift
          check if user is online: 
            if online:
              fetch the details of the active shift from the backend. If shift details are found, and still active and user is in the list of invited sellers to the shift, show and allow the user to proceed to the next step. if shift is found but sales is closed or shift is not found, show a message telling the user the shift is closed for sales and an exit button.
            if offline:
              show an offline message telling the user the authorisation to proceed on that shift cannot be verified. Ask the manager to verify with his credentials. or seller to go online.
    ----//else if user is not logged into any shift:
          if online:
            fetch the list of active shifts in the branch from the backend. And show the list to the user to select from. And save the selected shift as the active shift for the user on AuthContext locally and online.

          if offline:
            show an offline message telling the user the authorisation to proceed on any shift cannot be verified. Ask user to go online.
  */
  }
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
