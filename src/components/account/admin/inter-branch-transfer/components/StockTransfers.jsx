import Header from '@/components/account/AdminHeader';
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
import SubHeader from '../../SubHeader';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import Pagination from '@/components/account/Pagination';
import ErrorModal from '@/components/account/ErrorModal';
import ExportContent from '@/components/account/ExportContent';
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
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            {/* tabs + raise button */}
            <div className="flex flex-row justify-between items-center">
              <div
                className="flex gap-1 border-b border-gray-border"
                role="tablist"
              >
                {TABS.map((t) => (
                  <button
                    key={t.value}
                    role="tab"
                    aria-selected={tab === t.value}
                    onClick={() => switchTab(t.value)}
                    className={`px-4 py-2 text-sm ${
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
                className="p-2 text-sm shadow-md bg-blue-shadow1 text-text-white rounded-md hover:bg-brand-blue whitespace-nowrap flex flex-row gap-2"
              >
                <FaScroll className="text-base text-text-white" />
                Raise transfer
              </button>
            </div>

            {/* filters */}
            <div className="flex flex-col gap-2 border border-gray-border rounded-md p-2">
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="h-8 px-3 border border-gray-border rounded-md flex flex-row items-center w-1/3">
                  <FaSearch aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search by transfer ID/branch"
                    value={draftFilters.searchTerm}
                    onChange={(e) =>
                      onChangeFilter('searchTerm', e.target.value)
                    }
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    className="focus:outline-none ml-2 w-full text-sm"
                  />
                </div>

                {userBranches.length > 1 && (
                  <div className="h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray">
                    <FaHome
                      aria-hidden="true"
                      className="mr-2 text-brand-blue"
                    />
                    <select
                      value={draftFilters.branch}
                      onChange={(e) => onChangeFilter('branch', e.target.value)}
                      className="focus:outline-none cursor-pointer"
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

                <div className="h-8 px-2 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray">
                  <FaCalendar
                    aria-hidden="true"
                    className="mr-2 text-brand-blue"
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
                    className="w-40 focus:outline-none cursor-pointer"
                    aria-label="Filter by date range"
                  />
                </div>

                <div className="h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-sm text-text-gray">
                  <FaFilter aria-hidden="true" />
                  <select
                    value={draftFilters.status}
                    onChange={(e) => onChangeFilter('status', e.target.value)}
                    className="focus:outline-none cursor-pointer"
                  >
                    <option value="">All Status</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
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
            </div>

            {/* table */}
            {loading ? (
              <Spinner />
            ) : (
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left bg-gray-shadow10 text-sm text-text-gray">
                      <th className="px-4 py-4 border border-gray-shadow8">
                        Transfer ID
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        From
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        To
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Raised On
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Items
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Total Value
                      </th>
                      <th className="px-4 py-4 text-center border border-gray-shadow8">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-text-gray">
                    {transfers.length > 0 ? (
                      transfers.map((t) => {
                        const option = STATUS_OPTIONS.find(
                          (s) => s.value === t.status
                        );
                        return (
                          <tr
                            key={t._id}
                            onClick={() => setSelectedTransfer(t)}
                            className="border-b border-gray-border text-sm cursor-pointer hover:bg-gray-shadow10"
                          >
                            <td className="px-4 py-3">
                              {t.transferID}
                              {needsMyAction(t) && (
                                <span className="ml-2 text-xs text-brand-blue font-semibold">
                                  Needs your action
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {t.fromBranch?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {t.toBranch?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {t.createdAt
                                ? formatDate(new Date(t.createdAt))
                                : '-'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {t.itemCount ?? 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {t.totalCost != null
                                ? commaNumberFormat(t.totalCost, 2)
                                : '-'}
                            </td>
                            <td className="p-1">
                              <div className="flex items-center justify-center">
                                {option?.icon || null}
                                <span
                                  className={`px-4 py-2 ${
                                    option?.color || ' text-gray-500'
                                  }`}
                                >
                                  {option?.label ||
                                    capitalizeFirst(t.status) ||
                                    '-'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="text-center text-text-gray h-[40vh]">
                        <td className="font-semibold" colSpan={7}>
                          No {tab} transfers found.
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

      {selectedTransfer && (
        <div
          className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-end items-center"
          onClick={() => setSelectedTransfer(null)}
        >
          <TransferDetailSideView
            key={selectedTransfer._id}
            transfer={selectedTransfer}
            setTransfer={setSelectedTransfer}
            STATUS_OPTIONS={STATUS_OPTIONS}
            onAction={handleAction}
            onExport={setExportConfig}
          />
        </div>
      )}

      {showRaise && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[55] flex justify-center items-center">
          <RaiseTransferModal
            userBranches={userBranches}
            destinations={destinations}
            onClose={() => setShowRaise(false)}
            onRaised={handleRaised}
          />
        </div>
      )}

      {exportConfig && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[60] flex justify-center items-center">
          <ExportContent
            {...exportConfig}
            onClose={() => setExportConfig(null)}
          />
        </div>
      )}
    </div>
  );
};

export default StockTransfers;
