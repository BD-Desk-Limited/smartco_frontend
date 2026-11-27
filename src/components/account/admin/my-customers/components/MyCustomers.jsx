import Header from '@/components/account/admin/AdminHeader';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaHome, FaSort } from 'react-icons/fa';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import Pagination from '@/components/account/Pagination';
import ErrorModal from '@/components/account/ErrorModal';
import { getUserBranchesService } from '@/services/branchServices';
import { fetchCustomersService } from '@/services/customerServices';
import { fetchGroupsService } from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import CustomerProfileSideView from './CustomerProfileSideView';
import { useRouter } from 'next/navigation';
import FilterSheet from '@/components/account/admin/ui/FilterSheet';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

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
  const Router = useRouter();

  const onChangeFilter = (field, value) =>
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  const applyFilters = () => setSelectedFilters({ ...draftFilters, page: 1 });

  // dropdown source lists, fetched once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [branchesResult, groupsResult] = await Promise.allSettled([
        getUserBranchesService(),
        fetchGroupsService(),
      ]);
      if (cancelled) return;
      if (branchesResult.value?.data)
        setUserBranches(branchesResult.value.data);
      else
        setErrorMessage(
          branchesResult.value?.error || 'Error fetching branches'
        );
      if (groupsResult.value?.data)
        setGroups(groupsResult.value.data.groups || []);
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
    'h-10 md:h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray bg-white w-full md:w-auto';

  // rendered twice: next to the Filters button on phones, inline on md+
  const searchBox = (extraClass = '') => (
    <div
      className={`h-10 md:h-8 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray bg-white px-3 w-full ${extraClass}`}
    >
      <FaSearch aria-hidden="true" />
      <input
        type="search"
        placeholder="Search by name or customer number"
        aria-label="Search customers"
        value={draftFilters.searchTerm}
        onChange={(e) => onChangeFilter('searchTerm', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        className="focus:outline-none ml-2 w-full bg-transparent"
      />
    </div>
  );

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'My Customers'} />
      </div>
      <div className="flex flex-col md:flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit md:absolute md:left-0 md:top-0 md:z-50">
          <SideBar
            selectedSubMenu="my-customers"
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
            sideBarSubmenus={MY_CUSTOMER_SUBMENUS}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-3 md:p-5 mx-2 md:mx-5 mt-2 mb-6 rounded-md h-full flex flex-col gap-5">
            {/* filters: inline from md up, a bottom sheet on phones */}
            <FilterSheet
              activeCount={
                [
                  selectedFilters.searchTerm,
                  selectedFilters.branch,
                  selectedFilters.group,
                ].filter(Boolean).length
              }
              leading={searchBox('h-10')}
              onApply={applyFilters}
            >
              <div className="flex flex-col md:flex-row gap-3 md:gap-2 md:items-center md:border md:border-gray-border rounded-md md:p-2">
                {searchBox('hidden md:flex md:w-1/3')}

                {userBranches.length > 1 && (
                  <div className={box}>
                    <FaHome aria-hidden="true" className="mr-2 text-brand-blue" />
                    <select
                      value={draftFilters.branch}
                      onChange={(e) => onChangeFilter('branch', e.target.value)}
                      className="focus:outline-none cursor-pointer w-full bg-transparent"
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
                      className="focus:outline-none cursor-pointer w-full bg-transparent"
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
                    className="focus:outline-none cursor-pointer w-full bg-transparent"
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
                  className="hidden md:block px-4 h-8 text-sm bg-brand-blue text-white rounded-lg hover:bg-blue-shadow1"
                >
                  Apply filter
                </button>
              </div>
            </FilterSheet>

            {/* table */}
            {loading ? (
              <Spinner />
            ) : (
              <ResponsiveTable
                rows={customers}
                emptyMessage="No customers found."
                onRowClick={(c) => setSelectedCustomer(c)}
                columns={[
                  {
                    key: 'customer',
                    header: 'Customer',
                    align: 'left',
                    mobile: 'title',
                    cell: (c) => (
                      <>
                        <span className="block text-text-black">{c.name}</span>
                        <span className="text-xs font-semibold text-text-gray">
                          {c.customerNumber}
                        </span>
                      </>
                    ),
                  },
                  {
                    key: 'registered',
                    header: 'Registered at',
                    cell: (c) => c.registeredBranch?.name || 'N/A',
                  },
                  {
                    key: 'branches',
                    header: 'Branches',
                    cell: (c) => (
                      <span title={c.branches.map((b) => b.name).join(', ')}>
                        {c.branches.length}
                      </span>
                    ),
                  },
                  { key: 'visits', header: 'Visits', cell: (c) => c.stats.visits },
                  {
                    key: 'spent',
                    header: 'Total spent',
                    mobile: 'badge',
                    cellClass: () => 'font-semibold',
                    cell: (c) => commaNumberFormat(c.stats.totalSpent, 2),
                  },
                  {
                    key: 'lastVisit',
                    header: 'Last visit',
                    cell: (c) =>
                      c.stats.lastVisit
                        ? formatDate(new Date(c.stats.lastVisit))
                        : '-',
                  },
                  {
                    key: 'groups',
                    header: (
                      <button
                        type="button"
                        onClick={() =>
                          Router.push(
                            '/pages/account/admin/my-customers/customer-groups'
                          )
                        }
                        className="hover:text-brand-blue underline-offset-2 hover:underline"
                        title="Manage customer groups"
                      >
                        Groups
                      </button>
                    ),
                    mobileLabel: 'Groups',
                    cell: (c) =>
                      c.groups.length ? c.groups.map((g) => g.name).join(', ') : '-',
                  },
                ]}
              />
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
          <PageDescription pageDescription={pageDescription} />
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
          onClick={(e) => e.target === e.currentTarget && setSelectedCustomer(null)}
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
