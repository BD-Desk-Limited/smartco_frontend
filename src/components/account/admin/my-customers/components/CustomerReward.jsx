import Header from '@/components/account/AdminHeader';
import React, { useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';

const CustomerReward = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Customers Rewards'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute left-0 top-0 z-50">
          <SideBar
            selectedSubMenu="customer-rewards"
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
            sideBarSubmenus={MY_CUSTOMER_SUBMENUS}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            {/* Body */}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReward;
