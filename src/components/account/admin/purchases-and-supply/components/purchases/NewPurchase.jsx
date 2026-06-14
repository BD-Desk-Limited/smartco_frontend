import React from 'react';
import PageDescription from '@/components/account/PageDescription';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/AdminHeader';
import SubHeader from '../../../SubHeader';
import SideBar from '../../../SideBar';
import { PURCHASES_AND_SUPPLY_SUBMENUS } from '../PurchasesAndSupplySubMenus';
import { FaChevronDown } from 'react-icons/fa';
import SelectSupplierPannel from './SelectSupplierPannel';

const NewPurchase = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState([]);
  const [selectedSupplier, setSelectedSupplier] = React.useState(null);
  const [openSupplierSelectPannel, setOpenSupplierSelectPannel] =
    React.useState(false);
  const router = useRouter();

  const openSelectSupplierPannel = (e) => {
    e.stopPropagation();
    setOpenSupplierSelectPannel(true);
  };

  const closeSelectSupplierPannel = (e) => {
    e.stopPropagation();
    setOpenSupplierSelectPannel(false);
  };

  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'New Purchase Record'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit">
          <SideBar
            selectedSubMenu="new-purchase"
            sideBarSubmenus={PURCHASES_AND_SUPPLY_SUBMENUS}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>

        <div className="flex flex-col h-full w-full relative p-1 text-text-gray">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-[80%] flex flex-col gap-5">
            {/* Select supplier */}
            {!selectedSupplier ? (
              <div className="flex flex-row items-center w-full gap-10">
                <div className="flex flex-col w-full gap-1">
                  <label className="font-semibold text-sm text-text-black">
                    Select purchase supplier
                  </label>

                  <div
                    onClick={(e) => openSelectSupplierPannel(e)}
                    className="h-8 px-2 border border-gray-border rounded-md flex flex-row items-center w-full"
                  >
                    <span className="flex flex-row justify-between items-center gap-5 w-full cursor-pointer">
                      <span>Select supplier</span>
                      <FaChevronDown />
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span>selected supplier details</span>
                <span className="rounded-full border p-3">picture</span>
              </div>
            )}

            <hr />

            {openSupplierSelectPannel && (
              <div
                onClick={(e) => closeSelectSupplierPannel(e)}
                className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-center items-center "
              >
                <SelectSupplierPannel />
              </div>
            )}
          </div>

          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPurchase;
