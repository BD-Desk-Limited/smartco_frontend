import Header from '@/components/account/AdminHeader';
import React, { useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import { PURCHASES_AND_SUPPLY_SUBMENUS } from './PurchasesAndSupplySubMenus';
import { useRouter } from 'next/navigation';
import { FaFilter, FaSearch } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import Button from '@/components/account/Button';

const PurchasesAndSupply = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedStatusTypes, setSelectedStatusTypes] = useState('All');
  const [loading, setLoaading] = useState(false);
  const Router = useRouter();

  const allPossibleStatusType = [
    'pending',
    'approved',
    'fulfilled',
    'disputed',
  ];

  const filteredPurchases = [];

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
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            <div className="flex flex-row gap-5 w-full justify-between items-center">
              {/**Search Input  */}
              <div className="h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full">
                <FaSearch width={15} height={15} />
                <input
                  type="text"
                  placeholder="Search by order ID/Supplier name"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="focus:outline-none ml-2 w-full text-sm"
                />
              </div>

              {/** status filter */}
              <div className="flex flex-row gap-2 text-sm min-w-fit text-text-gray">
                <div className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center">
                  <FaFilter alt="sort" width={15} height={15} />
                  <select
                    value={selectedStatusTypes}
                    className="focus:outline-none cursor-pointer"
                  >
                    <option value={''}>All Status</option>
                    {allPossibleStatusType?.map((type) => (
                      <option key={type} className="">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/** quick buttons */}
              <div className="h-full text-sm border border-gray-shadow7 rounded-md flex justify-between gap-3 p-1">
                <button
                  onClick={() =>
                    Router.push('/pages/account/admin/purchases/new-purchase')
                  }
                  className="shadow-md bg-brand-gray text-text-white rounded-md hover:bg-gray-shadow2 p-0.5"
                >
                  Record new purchase
                </button>

                <button className="shadow-md bg-brand-gray text-text-white rounded-md hover:bg-gray-shadow2 p-0.5">
                  Start new order
                </button>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left bg-gray-shadow10 text-sm text-text-gray ">
                      <th className="px-4 py-2 border border-gray-shadow7">
                        Order I D
                      </th>
                      <th className="px-4 py-2 border border-gray-shadow7">
                        Supplier
                      </th>
                      <th className="px-4 py-2 border border-gray-shadow7">
                        Date
                      </th>
                      <th className="px-4 py-2 border border-gray-shadow7">
                        Expected Delivery
                      </th>
                      <th className="px-4 py-2 border border-gray-shadow7">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-text-gray">
                    {filteredPurchases.length > 0 ? (
                      <>
                        {filteredPurchases.map((purchase) => (
                          <tr
                            key={purchase._id}
                            className="border-b border-gray-border text-sm py-5 cursor-pointer hover:bg-gray-shadow10"
                          >
                            <td className="px-4 py-2">
                              <span>{purchase._id}</span>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr className="text-center text-text-gray h-[40vh]">
                        <td className="font-semibold" colSpan={5}>
                          No purchase record found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

export default PurchasesAndSupply;
