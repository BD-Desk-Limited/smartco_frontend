import React from 'react';

import Header from '@/components/account/Header';
import SubHeader from '@/components/account/admin/SubHeader';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/account/Spinner';
import { useAuth } from '@/contexts/authContext';
import PageDescription from '@/components/account/PageDescription';
import SideBar from '../../SideBar';
import CreateNewTaxBandForm from './CreateNewTaxBandForm';
import { TAX_MANAGEMENT_SUB_MENUS } from './TaxManagementSideBarItems';

const CreateNewTaxBand = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const Router = useRouter();
  const auth = useAuth();
  const loggedInUser = auth.user;

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Create new Tax band'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="create-tax-band"
            sideBarSubmenus={TAX_MANAGEMENT_SUB_MENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex justify-center items-center">
            <CreateNewTaxBandForm standAloneTaxManagement={true} />
          </div>
          <div className="">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTaxBand;
