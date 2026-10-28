import Header from '@/components/account/AdminHeader';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaHome, FaSort, FaUser } from 'react-icons/fa';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import Pagination from '@/components/account/Pagination';
import ErrorModal from '@/components/account/ErrorModal';
import { getUserBranchesService } from '@/services/branchServices';
import {
  fetchCustomersService,
  fetchCustomerGroupsService,
} from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import CustomerProfileSideView from './CustomerProfileSideView';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'lastVisited', label: 'Last visit' },
  { value: 'newest', label: 'Newest first' },
];

const buildInitialFilters = () => ({
  searchTerm: '',
  branch: '', // '' = every branch the user can see
  group: '',
  sortBy: 'name',
  page: 1,
  limit: 25,
});

const MyCustomers = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [userBranches, setUserBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [draftFilters, setDraftFilters] = useState(buildInitialFilters);
  const [selectedFilters, setSelectedFilters] = useState(draftFilters);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onChangeFilter = (field, value) =>
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  const applyFilters = () => setSelectedFilters({ ...draftFilters, page: 1 });

  // dropdown source lists, fetched once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [branchesResult, groupsResult] = await Promise.allSettled([
        getUserBranchesService(),
        fetchCustomerGroupsService(),
      ]);
      if (cancelled) return;
      if (branchesResult.value?.data)
        setUserBranches(branchesResult.value.data);
      else
        setErrorMessage(
          branchesResult.value?.error || 'Error fetching branches'
        );
      if (groupsResult.value?.data) setGroups(groupsResult.value.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // customers, refetched whenever the applied filters change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { branch, group, ...rest } = selectedFilters;
      const res = await fetchCustomersService({
        ...rest,
        branches: branch ? [branch] : [],
        groups: group ? [group] : [],
      });
      if (cancelled) return;
      if (res.error) {
        setErrorMessage(String(res.error));
        setCustomers([]);
      } else {
        setCustomers(res.data?.customers || []);
        setPagination(res.data?.pagination || null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedFilters]);

  const box =
    'h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray';

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'My Customers'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute left-0 top-0 z-50">
          <SideBar
            selectedSubMenu="my-customers"
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
            sideBarSubmenus={MY_CUSTOMER_SUBMENUS}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            {/* filters */}
            <div className="flex flex-row gap-2 items-center border border-gray-border rounded-md p-2">
              <div className={`${box} w-1/3 px-3`}>
                <FaSearch aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search by name or customer number"
                  value={draftFilters.searchTerm}
                  onChange={(e) => onChangeFilter('searchTerm', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="focus:outline-none ml-2 w-full"
                />
              </div>

              {userBranches.length > 1 && (
                <div className={box}>
                  <FaHome aria-hidden="true" className="mr-2 text-brand-blue" />
                  <select
                    value={draftFilters.branch}
                    onChange={(e) => onChangeFilter('branch', e.target.value)}
                    className="focus:outline-none cursor-pointer"
                    aria-label="Filter by branch"
                  >
                    <option value="">All branches</option>
                    {userBranches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {groups.length > 0 && (
                <div className={box}>
                  <FaFilter aria-hidden="true" className="mr-2" />
                  <select
                    value={draftFilters.group}
                    onChange={(e) => onChangeFilter('group', e.target.value)}
                    className="focus:outline-none cursor-pointer"
                    aria-label="Filter by customer group"
                  >
                    <option value="">All groups</option>
                    {groups.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={box}>
                <FaSort aria-hidden="true" className="mr-2" />
                <select
                  value={draftFilters.sortBy}
                  onChange={(e) => onChangeFilter('sortBy', e.target.value)}
                  className="focus:outline-none cursor-pointer"
                  aria-label="Sort customers"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={applyFilters}
                className="px-4 h-8 text-sm bg-brand-blue text-white rounded-lg hover:bg-blue-shadow1"
              >
                Apply filter
              </button>
            </div>

            {/* table */}
            {loading ? (
              <Spinner />
            ) : (
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left bg-gray-shadow10 text-sm text-text-gray">
                      <th className="px-4 py-2 border border-gray-shadow8">
                        Customers
                      </th>
                      <th className="px-4 py-2 text-center border border-gray-shadow8">
                        Registered at
                      </th>
                      <th className="px-4 py-2 text-center border border-gray-shadow8">
                        Branches
                      </th>
                      <th className="px-4 py-2 text-center border border-gray-shadow8">
                        Visits
                      </th>
                      <th className="px-4 py-2 text-center border border-gray-shadow8">
                        Total spent
                      </th>
                      <th className="px-4 py-2 text-center border border-gray-shadow8">
                        Last visit
                      </th>
                      <th className="px-4 py-2 text-center border border-gray-shadow8">
                        Groups
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-text-gray">
                    {customers.length > 0 ? (
                      customers.map((c) => (
                        <tr
                          key={c._id}
                          onClick={() => setSelectedCustomer(c)}
                          className="border-b border-gray-border text-sm cursor-pointer hover:bg-green-shadow8"
                        >
                          <td className="px-4 py-2 flex flex-row gap-2 items-end">
                            <FaUser className="text-lg" />
                            <span>
                              <span className="block text-text-black">
                                {c.name}
                              </span>
                              <span className="text-xs font-semibold">
                                {c.customerNumber}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {c.registeredBranch?.name || 'N/A'}
                          </td>
                          <td
                            className="px-4 py-2 text-center"
                            title={c.branches.map((b) => b.name).join(', ')}
                          >
                            {c.branches.length}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {c.stats.visits}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {commaNumberFormat(c.stats.totalSpent, 2)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {c.stats.lastVisit
                              ? formatDate(new Date(c.stats.lastVisit))
                              : '-'}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {c.groups.length
                              ? c.groups.map((g) => g.name).join(', ')
                              : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center text-text-gray h-[40vh]">
                        <td className="font-semibold" colSpan={7}>
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {pagination && (
              <Pagination
                currentPage={selectedFilters.page}
                totalPages={pagination?.totalPages || 1}
                onPageChange={(page) =>
                  setSelectedFilters((prev) => ({ ...prev, page }))
                }
              />
            )}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[70] flex justify-center items-center">
          <ErrorModal
            message={errorMessage}
            title={'Error'}
            buttonStyle={'bg-error'}
            onClose={() => setErrorMessage(null)}
            buttonText={'Close'}
            subText={'Please try again'}
          />
        </div>
      )}
      {selectedCustomer && (
        <div
          className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-end items-center"
          onClick={() => setSelectedCustomer(null)}
        >
          <CustomerProfileSideView
            key={selectedCustomer._id}
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MyCustomers;
