import Header from '@/components/account/admin/AdminHeader';
import React, { useState, useEffect } from 'react';
import SubHeader from '../../../SubHeader';
import SideBar from '../../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import { REPORTS_SUBMENUS } from '../REPORTS_SUBMENUS';
import Spinner from '@/components/account/Spinner';
import { FaChartLine } from 'react-icons/fa';
import { SALES_REPORT_NAVS } from './SALES_REPORT_NAVIGATIONS';

const SalesReports = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [selectedNav, setSelectedNav] = useState(SALES_REPORT_NAVS[0].name);
  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader FirstComponents={<Logo />} title={'Reports'} />
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
            {/* Navigations to reports on sales */}
            <section className="max-h-40 overflow-y-auto scrollbar-thin gap-5">
              {SALES_REPORT_NAVS.map((navItem) => (
                <span key={navItem.name}>{navItem.label}</span>
              ))}
            </section>

            {/* Report to show when nav is clicked */}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;

const Logo = () => {
  return <FaChartLine className="mx-1 text-text-gray" />;
};
