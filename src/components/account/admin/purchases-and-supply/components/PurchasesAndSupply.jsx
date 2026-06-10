import Header from '@/components/account/Header';
import React from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import { PURCHASES_AND_SUPPLY_SUBMENUS } from './PurchasesAndSupplySubMenus';
import { useRouter } from 'next/navigation';

const PurchasesAndSupply = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const router = useRouter();
  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'My Purchases'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="my-purchases"
            sideBarSubmenus={PURCHASES_AND_SUPPLY_SUBMENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-[80%] flex flex-col gap-5">
            There are no purchase record for the selected period
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasesAndSupply;
