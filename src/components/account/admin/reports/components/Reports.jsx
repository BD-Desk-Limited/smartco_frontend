import Header from '@/components/account/AdminHeader';
import React, { useState, useEffect } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import { REPORTS_SUBMENUS } from './reportsSubMenus';
import Spinner from '@/components/account/Spinner';

const Reports = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Reports'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="reports"
            sideBarSubmenus={REPORTS_SUBMENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            {/* body */}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
