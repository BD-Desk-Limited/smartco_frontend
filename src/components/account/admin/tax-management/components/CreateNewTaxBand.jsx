import React from 'react';

import Header from '@/components/account/admin/shell/AdminHeader';
import SubHeader from '@/components/account/admin/shell/SubHeader';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/account/common/Spinner';
import { useAuth } from '@/contexts/authContext';
import PageDescription from '@/components/account/common/PageDescription';
import SideBar from '../../shell/SideBar';
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
      <div className="flex flex-col md:flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="create-tax-band"
            sideBarSubmenus={TAX_MANAGEMENT_SUB_MENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="bg-white p-3 md:p-5 mx-2 md:mx-5 mt-2 mb-6 rounded-md h-full flex justify-center items-center">
            <CreateNewTaxBandForm standAloneTaxManagement={true} />
          </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
      </div>
    </div>
  );
};

export default CreateNewTaxBand;
