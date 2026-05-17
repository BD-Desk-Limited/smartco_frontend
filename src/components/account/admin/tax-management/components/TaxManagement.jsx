import Header from '@/components/account/Header';
import React from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import { TAX_MANAGEMENT_SUB_MENUS } from './TaxManagementSideBarItems';
import PageDescription from '@/components/account/PageDescription';
import { useAuth } from '@/contexts/authContext';

const TaxManagement = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const auth = useAuth();
  const loggedInUser = auth.user;

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Tax Management'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="view-tax-band-details"
            sideBarSubmenus={TAX_MANAGEMENT_SUB_MENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5"></div>
          <div className="">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxManagement;
