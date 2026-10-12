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

// declaring constants
const STATUS_OPTIONS = [
  {
    label: 'Pending',
    value: 'pending',
    color: 'bg-yellow-500  text-text-white',
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
        <div className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-center items-center ">
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
          />
        </div>
      )}
    </div>
  );
};

export default PurchasesAndSupply;
