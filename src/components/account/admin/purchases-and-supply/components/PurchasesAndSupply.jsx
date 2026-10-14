import Header from '@/components/account/AdminHeader';
import React, { useState, useEffect } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import PageDescription from '@/components/account/PageDescription';
import { PURCHASES_AND_SUPPLY_SUBMENUS } from './PurchasesAndSupplySubMenus';
import Spinner from '@/components/account/Spinner';
import PurchaseAndSupplyTable from './PurchaseAndSupplyTable';
import PurchasesAndSupplyFilters from './PurchasesAndSupplyFilters';
import { getUserBranchesService } from '@/services/branchServices';
import {
  fetchPurchaseRecordsService,
  fetchSuppliersByCompanyIdService,
} from '@/services/purchaseAndSupplyServices';
import { formatDate } from '@/utilities/formatTime';
import Pagination from '@/components/account/Pagination';
import ErrorModal from '@/components/account/ErrorModal';
import PurchaseAndSupplyDetailSideView from './PurchaseAndSupplyDetailSideView';
import ExportContent from '@/components/account/ExportContent';

// declaring constants
const OPEN_MARKET_ID = 'open_market';
const EXPORT_PAGE_SIZE = 100; // server maximum
const MAX_EXPORT_PAGES = 50; // safety cap: 5,000 rows

const STATUS_OPTIONS = [
  {
    label: 'Pending',
    value: 'pending',
    color: 'bg-yellow-500  text-text-white ',
  },
  {
    label: 'Approved',
    value: 'approved',
    color: 'bg-green-500  text-text-white',
  },
  {
    label: 'Fulfilled',
    value: 'fulfilled',
    color: 'bg-blue-500  text-text-white',
  },
  {
    label: 'Disputed',
    value: 'disputed',
    color: 'bg-text-white text-text-black border border-border-gray',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
    color: 'bg-gray-500  text-text-white',
  },
];

const buildInitialFilters = () => {
  const now = new Date();
  return {
    searchTerm: '',
    status: '', // '' = all statuses
    suppliers: [], // [] = all
    branches: [], // [] = all the user can access (server enforces access)
    from: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: formatDate(now),
    page: 1,
    limit: 50,
  };
};

// avoids float artifacts like 12.299999 in exports
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

const PurchasesAndSupply = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [userBranches, setUserBranches] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [draftFilters, setDraftFilters] = useState(buildInitialFilters);
  const [selectedFilters, setSelectedFilters] = useState(draftFilters);
  const [allPurchases, setAllPurchases] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // one export modal serves both the list and the side view
  const [exportConfig, setExportConfig] = useState(null);
  const [preparingExport, setPreparingExport] = useState(false);

  const onChangeFilter = (field, value) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  };

  // dropdown source lists, fetched once in parallel
  useEffect(() => {
    let cancelled = false;

    const fetchFilterOptions = async () => {
      setLoadingOptions(true);
      const [branchesResult, suppliersResult] = await Promise.allSettled([
        getUserBranchesService(),
        fetchSuppliersByCompanyIdService({
          searchTerm: '',
          page: 1,
          limit: 50,
        }),
      ]);
      if (cancelled) return;

      if (branchesResult.value?.data) {
        setUserBranches(branchesResult.value.data);
      } else {
        console.error(
          'Error fetching branches:',
          branchesResult.value?.error || branchesResult.reason
        );
        setErrorMessage(
          branchesResult.value?.error ||
            branchesResult.reason ||
            'Error fetching branches'
        );
      }

      // endpoint returns { suppliers, pagination }
      const suppliers = suppliersResult.value?.data?.suppliers;
      if (suppliers) {
        setAllSuppliers(suppliers);
      } else {
        console.error(
          'Error fetching suppliers:',
          suppliersResult.value?.error || suppliersResult.reason
        );
      }
      setLoadingOptions(false);
    };

    fetchFilterOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  // purchases, refetched whenever the applied filters change
  useEffect(() => {
    let cancelled = false;

    const fetchPurchases = async () => {
      setLoadingPurchases(true);
      try {
        const response = await fetchPurchaseRecordsService(selectedFilters);
        if (cancelled) return;
        if (response.error) {
          console.error('Error fetching purchases:', response.error);
          setErrorMessage(response.error || 'Error fetching purchases record');
          setAllPurchases([]);
        } else if (response.data) {
          setAllPurchases(response.data.purchases || []);
          setPagination(response.data.pagination || null);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        if (!cancelled) setLoadingPurchases(false);
      }
    };

    fetchPurchases();
    return () => {
      cancelled = true;
    };
  }, [selectedFilters]);

  // ---------- list export ----------

  // every page of the applied filters (the table only shows one page)
  const fetchAllPurchases = async (filters) => {
    const rows = [];
    let page = 1;
    let totalPages = 1;
    do {
      const res = await fetchPurchaseRecordsService({
        ...filters,
        page,
        limit: EXPORT_PAGE_SIZE,
      });
      if (res.error) throw new Error(String(res.error));
      rows.push(...(res.data?.purchases || []));
      totalPages = res.data?.pagination?.totalPages || 1;
      page += 1;
    } while (page <= totalPages && page <= MAX_EXPORT_PAGES);
    return rows;
  };

  const buildListExport = (rows) => {
    const f = selectedFilters;
    const statusLabel =
      STATUS_OPTIONS.find((s) => s.value === f.status)?.label || 'All';
    const branchNames = f.branches
      .map((id) => userBranches.find((b) => b._id === id)?.name)
      .filter(Boolean);
    const supplierNames = f.suppliers
      .map((id) =>
        id === OPEN_MARKET_ID
          ? 'Open market'
          : allSuppliers.find((s) => s._id === id)?.name
      )
      .filter(Boolean);
    // cancelled orders are left out of the grand total
    const grandTotal = rows
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.totalCost || 0), 0);

    return {
      title: 'Purchase Orders',
      fileName: `purchase-orders_${f.from || 'start'}_to_${f.to || 'today'}`,
      metadata: {
        Period: `${f.from || 'Start'} to ${f.to || 'Today'}`,
        Status: statusLabel,
        Branches: branchNames.length ? branchNames : 'All',
        Suppliers: supplierNames.length ? supplierNames : 'All',
        Orders: String(rows.length),
        'Total (excluding cancelled)': commaNumberFormat(grandTotal, 2),
      },
      emptyMessage: 'No purchase orders found',
      data: rows.map((r) => ({
        'Order ID': r.purchaseID || '-',
        Branch: r.receivingBranch?.name || 'N/A',
        Supplier: r.supplierName || 'N/A',
        Type: r.isOpenMarket ? 'Open market' : 'Supplier',
        Date: r.supplyDate ? formatDate(new Date(r.supplyDate)) : '-',
        Status: capitalizeFirst(r.status) || '-',
        Items: r.itemCount ?? 0,
        Total: round2(r.totalCost), // number, so Excel can sum it
      })),
    };
  };

  const handleExportList = async () => {
    setPreparingExport(true);
    try {
      // a single page already holds the whole result, so skip the extra requests
      const rows =
        (pagination?.totalPages || 1) <= 1
          ? allPurchases
          : await fetchAllPurchases(selectedFilters);

      if (rows.length === 0) {
        setErrorMessage(
          'There are no purchase orders to export for this selection.'
        );
        return;
      }
      setExportConfig(buildListExport(rows));
    } catch (err) {
      setErrorMessage(err.message || 'Could not prepare the export');
    } finally {
      setPreparingExport(false);
    }
  };

  return (
    <div className="h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Purchase Orders List'} />
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
            <PurchasesAndSupplyFilters
              selectedFilters={selectedFilters}
              draftFilters={draftFilters}
              setSelectedFilters={setSelectedFilters}
              setDraftFilters={setDraftFilters}
              onChangeFilter={onChangeFilter}
              allSuppliers={allSuppliers}
              formatDate={formatDate}
              userBranches={userBranches}
              STATUS_OPTIONS={STATUS_OPTIONS}
              onExport={handleExportList}
              preparingExport={preparingExport}
            />

            {loadingOptions || loadingPurchases ? (
              <Spinner />
            ) : (
              <PurchaseAndSupplyTable
                allPurchases={allPurchases}
                STATUS_OPTIONS={STATUS_OPTIONS}
                formatDate={formatDate}
                setSelectedOrder={setSelectedOrder}
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
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[70] flex justify-center items-center ">
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

      {selectedOrder && (
        <div
          className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-end items-center "
          onClick={() => setSelectedOrder(null)}
        >
          <PurchaseAndSupplyDetailSideView
            order={selectedOrder}
            setOrder={setSelectedOrder}
            STATUS_OPTIONS={STATUS_OPTIONS}
            onExport={setExportConfig}
          />
        </div>
      )}

      {/* rendered last and above the side view, so it opens on top of it */}
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

export default PurchasesAndSupply;
