import Header from '@/components/account/admin/shell/AdminHeader';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FaSearch,
  FaFilter,
  FaCalendar,
  FaHome,
  FaBook,
  FaScroll,
  FaExclamationTriangle,
  FaCheck,
  FaTimesCircle,
  FaClock,
  FaTimes,
} from 'react-icons/fa';
import SubHeader from '../../shell/SubHeader';
import PageDescription from '@/components/account/common/PageDescription';
import Spinner from '@/components/account/common/Spinner';
import Pagination from '@/components/account/common/Pagination';
import ErrorModal from '@/components/account/common/ErrorModal';
import ExportContent from '@/components/account/common/ExportContent';
import { getUserBranchesService } from '@/services/branchServices';
import {
  fetchTransfersService,
  fetchTransferDestinationsService,
  acceptTransferService,
  disputeTransferService,
  resubmitTransferService,
  cancelTransferService,
} from '@/services/transferServices';
import {
  formatDate,
  getDateNow,
  getFirstDayOfMonth,
} from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';
import { commaNumberFormat } from '@/utilities/numbersUtils';
import TransferDetailSideView from './TransferDetailSideView';
import RaiseTransferModal from './RaiseTransferModal';
import FilterSheet from '../../ui/FilterSheet';
import ResponsiveTable from '../../ui/ResponsiveTable';
import SideView from '../../ui/SideView';
import Modal from '../../ui/Modal';

const TABS = [
  { value: 'incoming', label: 'Incoming Transfers' },
  { value: 'outgoing', label: 'Outgoing Transfers' },
];

const STATUS_OPTIONS = [
  {
    label: 'Pending',
    value: 'pending',
    color: 'text-yellow-500 font-semibold border-none',
    icon: <FaClock className="text-yellow-500" />,
  },
  {
    label: 'Disputed',
    value: 'disputed',
    color: 'text-error font-semibold border-none',
    icon: <FaExclamationTriangle className="text-error" />,
  },
  {
    label: 'Accepted',
    value: 'accepted',
    color: 'text-green-500',
    icon: <FaCheck className="text-green-500 font-semibold border-none" />,
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
    color: 'text-gray-500',
    icon: <FaTimes className="text-gray-500 font-semibold border-none" />,
  },
];

const ACTIONS = {
  accept: acceptTransferService,
  dispute: disputeTransferService,
  resubmit: resubmitTransferService,
  cancel: cancelTransferService,
};

// no default date range: an old pending transfer must never drop out of view
const buildInitialFilters = () => ({
  searchTerm: '',
  status: '',
  branch: '',
  from: getFirstDayOfMonth(),
  to: getDateNow(),
  page: 1,
  limit: 50,
});

const parseDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) || formatDate(date) !== value
    ? null
    : date;
};

const needsMyAction = (t) =>
  t.permissions?.canAccept || t.permissions?.canResubmit;

const StockTransfers = ({ pageDescription }) => {
  const [tab, setTab] = useState('incoming');
  const [userBranches, setUserBranches] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [draftFilters, setDraftFilters] = useState(buildInitialFilters);
  const [selectedFilters, setSelectedFilters] = useState(draftFilters);
  const [transfers, setTransfers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showRaise, setShowRaise] = useState(false);
  const [exportConfig, setExportConfig] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onChangeFilter = (field, value) =>
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  const applyFilters = () => setSelectedFilters({ ...draftFilters, page: 1 });

  // dropdown source lists, fetched once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [branchesResult, destinationsResult] = await Promise.allSettled([
        getUserBranchesService(),
        fetchTransferDestinationsService(),
      ]);
      if (cancelled) return;
      if (branchesResult.value?.data)
        setUserBranches(branchesResult.value.data);
      else
        setErrorMessage(
          branchesResult.value?.error || 'Error fetching branches'
        );
      if (destinationsResult.value?.data)
        setDestinations(destinationsResult.value.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // transfers, refetched when the tab, applied filters or reloadKey change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { branch, ...rest } = selectedFilters;
      const res = await fetchTransfersService({
        ...rest,
        branches: branch ? [branch] : [],
        direction: tab,
      });
      if (cancelled) return;
      if (res.error) {
        setErrorMessage(String(res.error));
        setTransfers([]);
      } else {
        setTransfers(res.data?.transfers || []);
        setPagination(res.data?.pagination || null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, selectedFilters, reloadKey]);

  const switchTab = (value) => {
    setTab(value);
    setSelectedFilters((prev) => ({ ...prev, page: 1 }));
  };

  // runs accept / dispute / resubmit / cancel, then swaps in the updated transfer everywhere
  const handleAction = async (kind, id, payload) => {
    const res = await ACTIONS[kind](id, payload);
    if (res.error) return { error: String(res.error) };
    const updated = res.data;
    setSelectedTransfer(updated);
    setTransfers((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
    return { ok: true };
  };

  const handleRaised = (created) => {
    setShowRaise(false);
    setTab('outgoing');
    setSelectedFilters((prev) => ({ ...prev, page: 1 }));
    setReloadKey((k) => k + 1);
    if (created) setSelectedTransfer(created);
  };

  // rendered twice: next to the Filters button on phones, in the filter row on md+
  const searchBox = (extraClass = '') => (
    <div
      className={`h-10 md:h-8 px-3 border border-gray-border rounded-md flex-row items-center bg-white ${extraClass}`}
    >
      <FaSearch aria-hidden="true" className="shrink-0" />
      <input
        type="search"
        enterKeyHint="search"
        placeholder="Search by transfer ID/branch"
        aria-label="Search by transfer ID or branch"
        value={draftFilters.searchTerm}
        onChange={(e) => onChangeFilter('searchTerm', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
        className="focus:outline-none ml-2 w-full text-base md:text-sm bg-transparent"
      />
    </div>
  );

  const statusCell = (t) => {
    const option = STATUS_OPTIONS.find((s) => s.value === t.status);
    return (
      <span className="flex items-center justify-center whitespace-nowrap">
        {option?.icon || null}
        <span
          className={`px-2 md:px-4 py-1 md:py-2 ${option?.color || ' text-gray-500'}`}
        >
          {option?.label || capitalizeFirst(t.status) || '-'}
        </span>
      </span>
    );
  };

  const transferColumns = [
    {
      key: 'id',
      header: 'Transfer ID',
      align: 'left',
      mobile: 'title',
      cell: (t) => (
        <>
          {t.transferID}
          {needsMyAction(t) && (
            <span className="ml-2 text-xs text-brand-blue font-semibold">
              Needs your action
            </span>
          )}
        </>
      ),
    },
    {
      key: 'route',
      header: 'From',
      mobile: 'subtitle',
      // phones show "From -> To" on one line; the table keeps two columns
      cell: (t) => (
        <>
          <span className="md:hidden">
            {t.fromBranch?.name || 'N/A'} → {t.toBranch?.name || 'N/A'}
          </span>
          <span className="hidden md:inline">
            {t.fromBranch?.name || 'N/A'}
          </span>
        </>
      ),
    },
    {
      key: 'to',
      header: 'To',
      mobile: 'hidden',
      cell: (t) => t.toBranch?.name || 'N/A',
    },
    {
      key: 'raised',
      header: 'Raised On',
      cell: (t) => (t.createdAt ? formatDate(new Date(t.createdAt)) : '-'),
    },
    { key: 'items', header: 'Items', cell: (t) => t.itemCount ?? 0 },
    {
      key: 'total',
      header: 'Total Value',
      cell: (t) =>
        t.totalCost != null ? commaNumberFormat(t.totalCost, 2) : '-',
    },
    { key: 'status', header: 'Status', mobile: 'badge', cell: statusCell },
  ];

  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Stock Transfers'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-3 md:p-5 mx-2 md:mx-5 mt-2 mb-6 rounded-md h-full flex flex-col gap-4 md:gap-5">
            {/* tabs + raise button */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between sm:items-center">
              <div
                className="flex gap-1 border-b border-gray-border overflow-x-auto no-scrollbar"
                role="tablist"
              >
                {TABS.map((t) => (
                  <button
                    key={t.value}
                    role="tab"
                    aria-selected={tab === t.value}
                    onClick={() => switchTab(t.value)}
                    className={`px-4 py-2 text-sm whitespace-nowrap ${
                      tab === t.value
                        ? 'border-b-2 border-brand-blue text-brand-blue font-semibold'
                        : 'text-text-gray'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRaise(true)}
                className="p-2 text-sm shadow-md bg-blue-shadow1 text-text-white rounded-md hover:bg-brand-blue whitespace-nowrap flex flex-row gap-2 self-end sm:self-auto"
              >
                <FaScroll className="text-base text-text-white" />
                Raise transfer
              </button>
            </div>

            {/* filters */}
            <div className="flex flex-col gap-2 md:border border-gray-border rounded-md md:p-2">
              <FilterSheet
                activeCount={
                  (selectedFilters.branch ? 1 : 0) +
                  (selectedFilters.from || selectedFilters.to ? 1 : 0) +
                  (selectedFilters.status ? 1 : 0)
                }
                leading={searchBox('flex w-full')}
                onApply={applyFilters}
              >
                <div className="flex flex-col md:flex-row gap-3 md:gap-2 md:items-center w-full">
                  {searchBox('hidden md:flex md:w-1/3')}

                  {userBranches.length > 1 && (
                    <div className="h-10 md:h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray bg-white">
                      <FaHome
                        aria-hidden="true"
                        className="mr-2 text-brand-blue shrink-0"
                      />
                      <select
                        value={draftFilters.branch}
                        onChange={(e) =>
                          onChangeFilter('branch', e.target.value)
                        }
                        className="focus:outline-none cursor-pointer w-full md:w-auto bg-transparent"
                        aria-label="Filter by your branch"
                      >
                        <option value="">All my branches</option>
                        {userBranches.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="h-10 md:h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray bg-white">
                    <FaCalendar
                      aria-hidden="true"
                      className="mr-2 text-brand-blue shrink-0"
                    />
                    <DatePicker
                      selectsRange
                      startDate={parseDate(draftFilters.from)}
                      endDate={parseDate(draftFilters.to)}
                      onChange={([from, to]) => {
                        onChangeFilter('from', from ? formatDate(from) : '');
                        onChangeFilter('to', to ? formatDate(to) : '');
                      }}
                      placeholderText="Any date"
                      dateFormat="yyyy-MM-dd"
                      className="w-full md:w-40 focus:outline-none cursor-pointer"
                      aria-label="Filter by date range"
                    />
                  </div>

                  <div className="h-10 md:h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray bg-white">
                    <FaFilter aria-hidden="true" className="shrink-0" />
                    <select
                      value={draftFilters.status}
                      onChange={(e) => onChangeFilter('status', e.target.value)}
                      aria-label="Filter by status"
                      className="focus:outline-none cursor-pointer w-full md:w-auto bg-transparent"
                    >
                      <option value="">All Status</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* md+; phones apply from the sheet's "Show results" */}
                  <button
                    onClick={applyFilters}
                    className="hidden md:block px-4 h-8 text-sm bg-brand-blue text-white rounded-lg hover:bg-blue-shadow1"
                  >
                    Apply filter
                  </button>
                </div>
              </FilterSheet>
            </div>

            {/* table (cards on phones) */}
            {loading ? (
              <Spinner />
            ) : (
              <ResponsiveTable
                columns={transferColumns}
                rows={transfers}
                getRowKey={(t) => t._id}
                onRowClick={setSelectedTransfer}
                emptyMessage={`No ${tab} transfers found.`}
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
        <Modal
          bare
          zClass="z-[70]"
          label="Error"
          onClose={() => setErrorMessage(null)}
        >
          <ErrorModal
            message={errorMessage}
            title={'Error'}
            buttonStyle={'bg-error'}
            onClose={() => setErrorMessage(null)}
            buttonText={'Close'}
            subText={'Please try again'}
          />
        </Modal>
      )}

      {selectedTransfer && (
        <SideView
          onClose={() => setSelectedTransfer(null)}
          label="Transfer details"
        >
          <TransferDetailSideView
            key={selectedTransfer._id}
            transfer={selectedTransfer}
            setTransfer={setSelectedTransfer}
            STATUS_OPTIONS={STATUS_OPTIONS}
            onAction={handleAction}
            onExport={setExportConfig}
          />
        </SideView>
      )}

      {showRaise && (
        <Modal bare zClass="z-[55]" label="Raise stock transfer">
          <RaiseTransferModal
            userBranches={userBranches}
            destinations={destinations}
            onClose={() => setShowRaise(false)}
            onRaised={handleRaised}
          />
        </Modal>
      )}

      {exportConfig && (
        <Modal
          bare
          zClass="z-[60]"
          label="Export"
          onClose={() => setExportConfig(null)}
        >
          <ExportContent
            {...exportConfig}
            onClose={() => setExportConfig(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default StockTransfers;
