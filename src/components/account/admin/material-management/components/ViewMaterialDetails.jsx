import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/AdminHeader';
import MaterialSidebar from './materialSidebar';
import SubHeader from '../../SubHeader';
import Image from 'next/image';
import Button from '@/components/account/Button';
import GroupedMaterialBreakdown from './groupedMaterials/GroupedMaterialBreakdown';

const ViewMaterialDetails = ({
  materialData,
  allUserBranches,
  requestedBranches,
  setRequestedBranches,
  pageDescription,
}) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = React.useState(false);
  const [draftSelected, setDraftSelected] = React.useState([]);
  const Router = useRouter();

  const selectedSubMenu = {
    name: 'View All Materials',
    link: '/view-materials',
  };

  const stockByBranch = materialData.stockByBranch || [];
  const grandTotal = materialData.grandTotal || 0;

  const effectiveSelected =
    requestedBranches.length > 0
      ? requestedBranches
      : allUserBranches.map((b) => b._id);

  const allSelected =
    allUserBranches.length > 0 &&
    allUserBranches.every((b) => draftSelected.includes(b._id));

  const someSelected = draftSelected.length > 0 && !allSelected;

  return (
    <div className="w-full h-full max-h-screen overflow-hidden">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'View Material details'} />
      </div>
      <div className="flex flex-col gap-0 w-full h-full relative">
        <div className="w-fit absolute top-0 left-0">
          <MaterialSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>

        <div className="flex flex-col w-full max-h-[90%]">
          <div className="bg-white p-5 m-3 rounded-md max-h-[90vh] overflow-y-auto no-scrollbar text-text-gray flex flex-row gap-5 px-3 py-5">
            {/* Image and details */}
            <div className="items-center w-1/4">
              <Image
                src={materialData.imageURL || '/assets/edit-material.png'}
                alt={materialData.name || 'Material Image'}
                width={200}
                height={200}
                className="rounded-[100%] h-[200px] w-[200px]"
              />
              <div>
                <h1 className="font-bold text-lg">{materialData.name}</h1>

                <p className="max-h-28 overflow-y-auto scrollbar-thin py-1 italic">
                  {materialData.description}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="flex flex-col gap-1">Material Type:</span>
                    <span className="font-semibold text-base">
                      {materialData.materialType}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="flex flex-col gap-1">
                      Material Category:{' '}
                    </span>
                    <span className="font-semibold text-base">
                      {materialData.category?.name}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="flex flex-col gap-1">Unit: </span>
                    <span className="font-semibold text-base">
                      {materialData.unitOfMeasurement?.name}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 h-full w-full overflow-y-auto no-scrollbar ">
              {/** component breakdown */}
              <div className=" justify-start flex">
                {materialData.isGroup && (
                  <GroupedMaterialBreakdown id={materialData._id} />
                )}
              </div>

              <hr className="" />
              {/** stock Level */}
              <div className="w-full h-full my-3 ">
                <div className="flex flex-row gap-2 items-center mb-5">
                  <span className="font-semibold">Stock Level:</span>
                  {/** Branches dropdown */}
                  {allUserBranches.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => {
                          setDraftSelected(effectiveSelected);
                          setBranchDropdownOpen((o) => !o);
                        }}
                        className="h-8 px-3 border border-gray-border rounded-md flex flex-row items-center gap-2 text-sm"
                      >
                        <span>
                          {effectiveSelected.length === allUserBranches.length
                            ? 'All Branches'
                            : `${effectiveSelected.length} Branch${effectiveSelected.length !== 1 ? 'es' : ''} Selected`}
                        </span>
                        <Image
                          src="/assets/filter.png"
                          alt="filter"
                          width={12}
                          height={12}
                        />
                      </button>
                      {branchDropdownOpen && (
                        <div className="absolute z-10 bg-white border border-gray-border rounded-md mt-1 p-2 shadow-md min-w-[200px]">
                          <label className="flex flex-row items-center gap-2 py-1 text-sm cursor-pointer border-b border-gray-border mb-1 pb-1">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              ref={(el) => {
                                if (el) el.indeterminate = someSelected; // dash when only some are ticked
                              }}
                              onChange={() =>
                                setDraftSelected(
                                  allSelected
                                    ? []
                                    : allUserBranches.map((b) => b._id)
                                )
                              }
                            />
                            <span>All branches</span>
                          </label>
                          {allUserBranches.map((branch) => (
                            <label
                              key={branch._id}
                              className="flex flex-row items-center gap-2 py-1 text-sm cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={draftSelected.includes(branch._id)}
                                onChange={() => {
                                  setDraftSelected((prev) =>
                                    prev.includes(branch._id)
                                      ? prev.filter((id) => id !== branch._id)
                                      : [...prev, branch._id]
                                  );
                                }}
                              />
                              <span>{branch.name}</span>
                            </label>
                          ))}
                          <div className="flex flex-row justify-end gap-2 pt-2 mt-1 border-t border-gray-border">
                            <button
                              onClick={() => setBranchDropdownOpen(false)}
                              className="text-xs px-2 py-1 rounded-md text-text-gray hover:bg-gray-shadow10"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setRequestedBranches(draftSelected);
                                setBranchDropdownOpen(false);
                              }}
                              className="text-xs px-2 py-1 rounded-md bg-brand-blue text-white hover:bg-blue-shadow1"
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="ml-5 font-bold text-sm">
                    Grand Total: {grandTotal}
                  </div>
                </div>

                <div className="flex flex-col justify-start w-auto mx-5 overflow-y-auto scrollbar-thin">
                  {/** stock level display table*/}
                  <span className="w-full">
                    {stockByBranch.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {stockByBranch.map((branchStock) => (
                          <div key={branchStock.branchId}>
                            <h3 className="font-semibold text-sm mb-1">
                              {branchStock.branchName}
                            </h3>
                            {branchStock.batches.length > 0 ? (
                              <div className="overflow-y-auto scrollbar-thin max-h-40">
                                <table className="w-full border-collapse rounded-sm">
                                  <thead className=" sticky top-0">
                                    <tr className="w-full px-5 py-0 rounded-t-lg flex flex-row justify-between gap-5 bg-brand-blue text-white border-b-2 border-b-text-white text-sm text-start">
                                      <th className="w-1/4 text-left">
                                        Batch ID
                                      </th>
                                      <th className="w-1/4 text-left">
                                        Balance
                                      </th>
                                      <th className="w-1/4 text-left">
                                        Supply Date
                                      </th>
                                      <th className="w-1/4 text-left">
                                        Expiry Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {branchStock.batches.map((stockLevel) => (
                                      <tr
                                        key={stockLevel._id}
                                        className="w-full flex flex-row gap-5 border-b-2 border-b-text-white bg-blue-shadow10 text-sm px-5 py-0.25"
                                      >
                                        <td className="w-1/4 text-left">
                                          {stockLevel.batch_number}
                                        </td>
                                        <td className="w-1/4 text-left">
                                          {stockLevel.balance}
                                        </td>
                                        <td className="w-1/4 text-left">
                                          {new Date(
                                            stockLevel.createdAt
                                          ).toLocaleDateString()}
                                        </td>
                                        <td className="w-1/4 text-left">
                                          {stockLevel.expiryDate
                                            ? new Date(
                                                stockLevel.expiryDate
                                              ).toLocaleDateString()
                                            : 'Not specified'}
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="w-full px-5 py-0 rounded-b-lg flex flex-row gap-5 bg-brand-blue text-white text-sm font-semibold">
                                      <td>Branch Total stock balance:</td>
                                      <td>{branchStock.totalStock}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <span className="text-sm text-error">
                                No stock available for this branch
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2 font-semibold text-error">
                        No stock available
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full gap-10 py-4 justify-center items-center sticky bottom-0 ">
            <Button
              text={'Edit Material'}
              onClick={
                materialData.isGroup
                  ? () =>
                      Router.push(
                        `/pages/account/admin/manage-materials/edit-grouped-material?id=${materialData._id}`
                      )
                  : () =>
                      Router.push(
                        `/pages/account/admin/manage-materials/edit-material?id=${materialData._id}`
                      )
              }
            />
            <Button
              text={'Exit'}
              onClick={
                materialData.isGroup
                  ? () =>
                      Router.push(
                        '/pages/account/admin/manage-materials/view-grouped-materials'
                      )
                  : () =>
                      Router.push(
                        '/pages/account/admin/manage-materials/view-materials'
                      )
              }
              buttonStyle={'bg-brand-gray px-5'}
            />
          </div>
        </div>
        <PageDescription pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default ViewMaterialDetails;
