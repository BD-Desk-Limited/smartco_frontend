import Header from '@/components/account/Header';
import React, { useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import { TAX_MANAGEMENT_SUB_MENUS } from './TaxManagementSideBarItems';
import PageDescription from '@/components/account/PageDescription';
import { useAuth } from '@/contexts/authContext';
import { FaFileExport, FaSearch } from 'react-icons/fa';
import ExportContent from '@/components/account/ExportContent';
import Spinner from '@/components/account/Spinner';

const TaxManagement = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const auth = useAuth();
  const loggedInUser = auth.user;
  const [searchterm, setSearchterm] = useState('');
  const [exportContent, setExportContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taxBands, setTaxBands] = useState([]);
  const [filteredTaxBands, setFilteredTaxBands] = useState([]);

  const handleCloseAllModals = () => {
    setExportContent(false);
  };

  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Manage Tax Profile'} />
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
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-[80%] flex flex-col gap-5">
            {/* search Input and filter */}
            <div className="flex items-center justify-between gap-10">
              <div className="h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full">
                <FaSearch className="text-text-gray text-sm" />
                <input
                  type="text"
                  placeholder="Search profile name or associated branch name"
                  value={searchterm}
                  onChange={(e) => setSearchterm(e.target.value)}
                  className="focus:outline-none ml-2 w-full text-sm"
                />
              </div>
              <button
                className="h-8 py-1 px-2 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1"
                onClick={() => setExportContent(true)}
              >
                <FaFileExport />
                <span className="text-sm">Export</span>
              </button>
            </div>

            {/* TaxProfiles table */}
            {loading ? (
              <Spinner />
            ) : (
              <div className="overflow-x-auto w-full h-full min-h-[50vh] max-h-[60vh] overflow-y-auto scrollbar-thin relative">
                <table className="w-full table-auto relative">
                  <thead className="bg-background-1 sticky top-[-1px] z-10">
                    <tr className="text-left text-text-gray text-sm font-medium border border-gray-border">
                      <th className="px-2 py-2 border border-gray-border text-center">
                        TAX PROFILE NAME
                      </th>
                      <th className="px-2 py-2 border border-gray-border text-center">
                        TAX BAND RATE
                      </th>
                      <th className="px-2 py-2 border border-gray-border text-center">
                        EFFECTIVE DATE
                      </th>
                      <th className="px-2 py-2 border border-gray-border text-center">
                        ASSOCIATED BRANCHES
                      </th>
                      <th className="px-2 py-2 border border-gray-border text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/*<tbody className="text-sm text-text-gray min-h-[40vh] w-full">
                    {filteredTaxBands?.length > 0 ? (
                      filteredTaxBands?.map((band) => (
                        <tr
                          key={band._id}
                          className={`border-b border-gray-border hover:bg-gray-shadow10 hover:text-text-black cursor-pointer items-center w-full`}
                          onClick={()=>console.log(band._id)}
                        >
                          <td
                            className={`px-2 py-2 text-left flex items-center gap-2`}
                          >
                            <input
                              type="checkbox"
                              value={band._id}
                              checked={selectedProduct.includes(band._id)}
                              onClick={(e) => e.stopPropagation()} // Stop event propagation
                              onChange={(e) => {
                                e.stopPropagation(); // Stop event propagation
                                handleSelectProduct(e.target.value);
                              }}
                              className="cursor-pointer mr-5"
                            />

                            <Image
                              src={
                                band?.imageURL || '/assets/shopping-bag.png'
                              }
                              alt={band?.name || 'Product Image'}
                              width={30}
                              height={30}
                              className="object-cover"
                            />
                            <span
                              className={`px-2 py-2 text-center font-semibold`}
                            >
                              {band?.name || '-'}
                            </span>
                          </td>
                          <td className={`px-2 py-2 text-center w-1/6`}>
                            {band?._id || '-'}
                          </td>
                          <td className={`px-2 py-2 text-center w-1/6`}>
                            {band?.category?.name || '-'}
                          </td>
                          <td className={`px-2 py-2 text-center w-1/6`}>
                            Available in
                            <span className="font-semibold">
                              {` ${band?.availability || 0}`}
                            </span>
                            {band?.availability > 1
                              ? ' branches'
                              : ' branch'}
                          </td>

                          
                          <td className={`px-2 py-2 text-center w-1/6`}>
                            <span className="flex flex-row items-center gap-2 justify-around">
                              <button>
                                <Image
                                  src="/assets/edit.png"
                                  alt="edit"
                                  width={15}
                                  height={15}
                                  className="cursor-pointer"
                                  title="Edit Product"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Stop event propagation
                                    Router.push(
                                      `/pages/account/admin/band-management/edit-band?id=${band._id}`
                                    );
                                  }}
                                />
                              </button>
                              <button className="">
                                <Image
                                  src={
                                    band.isDisabled !== true
                                      ? '/assets/switch_active.png'
                                      : '/assets/switch_inactive.png'
                                  }
                                  alt="delete"
                                  width={20}
                                  height={20}
                                  title={
                                    band.isDisabled
                                      ? 'Enable Product'
                                      : 'Disable Product'
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEnableOrDisableModal(e, [
                                      band._id,
                                    ]);
                                  }}
                                  className="cursor-pointer"
                                />
                              </button>
                              <button className="">
                                <Image
                                  src="/assets/delete.png"
                                  alt="delete"
                                  width={15}
                                  height={15}
                                  title="Delete Product"
                                  onClick={(e) =>
                                    handleOpenDeleteModal(e, [band._id])
                                  }
                                  className="cursor-pointer"
                                />
                              </button>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-32">
                          <div className="flex flex-col w-full justify-center items-center gap-4">
                            <span className="text-lg">No products found</span>
                            <Link
                              href="/pages/account/admin/band-management/create-new-band"
                              className="flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1"
                            >
                              <Image
                                src="/assets/add.png"
                                alt="add"
                                width={15}
                                height={15}
                              />
                              <span>start by creating a band</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>*/}
                </table>
              </div>
            )}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>

      {/* Export Content Modal */}
      {exportContent && filteredTaxBands.length > 0 && (
        <div className="inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <ExportContent
            metadata={{
              Date: [new Date().toLocaleDateString()],
              Time: [new Date().toLocaleTimeString()],
            }}
            data={filteredTaxBands.map((band, index) => {
              return {
                'S/No': index + 1,
                Name: band?.name,
                'Profile ID': band?._id,
              };
            })}
            onClose={() => setExportContent(false)}
            title={'Export Tax Profiles'}
          />
        </div>
      )}
    </div>
  );
};

export default TaxManagement;
