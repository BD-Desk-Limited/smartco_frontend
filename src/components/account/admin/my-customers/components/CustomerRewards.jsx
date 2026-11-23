import Header from '@/components/account/AdminHeader';
import React, { useEffect, useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import {
  fetchFlaggedRedemptionsService,
  fetchPromoByIdService,
  fetchPromoOptionsService,
  fetchPromosService,
} from '@/services/customerServices';
import PromoDetailSideView, { PHASE } from './PromoDetailSideView';
import PromoFormModal from './PromoFormModal';
import PromosList from './PromosList';
import FlaggedRedemptions from './FlaggedRedemptions';
import RewardsGivenReport from './RewardsGivenReport';

const formatInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const today = new Date();

const buildInitialFilter = () => {
  return {
    status: 'all',
    dateRange: {
      from: formatInputDate(new Date(today.getFullYear(), 0, 1)),
      to: formatInputDate(today),
    },
  };
};

const TABS = [
  { value: 'list-promos', label: 'Promos' },
  { value: 'claims-report', label: 'Customer Claims Report' },
  { value: 'flagged-claims', label: 'Flagged Customer Claims' },
];
const PROMO_STATUSES = ['draft', 'active', 'paused', 'ended'];

const CustomerRewards = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [promos, setPromos] = useState(null);
  const [branchNames, setBranchNames] = useState([]);
  const [options, setOptions] = useState({
    currency: '',
    branches: [],
    groups: [],
    permissions: { canManage: false },
  });
  const [tab, setTab] = useState('list-promos');
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null); // null | { promo } (promo null = create)
  const [openStatusesDropDown, setOpenStatusesDropDown] = useState(false);
  const [filterDraft, setFilterDraft] = useState(buildInitialFilter);
  const [filter, setFilter] = useState(buildInitialFilter);
  const [loading, setLoading] = useState(false);
  const [flaggedCustomerClaims, setFlaggedCustomerClaims] = useState({
    rows: [],
    pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  });
  const [openFlagCount, setOpenFlagCount] = useState(0); // to show number of flagged claims for review

  // fetch the open-flag count up front so the tab tag shows before the tab is opened
  useEffect(() => {
    let cancelled = false;
    fetchFlaggedRedemptionsService({ status: 'open', page: 1, limit: 1 }).then(
      (res) => {
        if (cancelled || res?.error) return;
        setOpenFlagCount(res?.data?.pagination?.totalCount ?? 0);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetch = () => {
      let cancelled = false;
      fetchPromoOptionsService().then((res) => {
        if (!cancelled && res.data) setOptions(res.data);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      let cancelled = false;
      try {
        setLoading(true);
        await fetchPromosService(filter).then((res) => {
          if (cancelled) return;
          if (res.error) setError(String(res.error));
          else {
            setError('');
            setPromos(res.data.promos);
            setBranchNames(res.data.branchNames || []);
          }
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
        setOpenStatusesDropDown(false);
      }

      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [filter, reload, setLoading]);

  const refresh = () => setReload((r) => r + 1);

  const applyFilter = () => {
    setFilter({
      status: filterDraft.status,
      dateRange: {
        from:
          filterDraft.dateRange.from ||
          formatInputDate(new Date(today.getFullYear(), 0, 1)),
        to: filterDraft.dateRange.to || formatInputDate(today),
      },
    });
  };

  const onStatusChange = (value, checked) => {
    setFilterDraft((prev) => {
      if (value === 'all') {
        return { ...prev, status: checked ? 'all' : [] };
      }

      const selectedStatuses =
        prev.status === 'all' ? PROMO_STATUSES : prev.status;
      const nextStatuses = checked
        ? [...selectedStatuses, value]
        : selectedStatuses.filter((status) => status !== value);

      return {
        ...prev,
        status:
          nextStatuses.length === PROMO_STATUSES.length ? 'all' : nextStatuses,
      };
    });
  };

  const resetFilter = () => {
    const reset = buildInitialFilter();
    setOpenStatusesDropDown(false);
    setFilterDraft(reset);
    setFilter(reset);
  };

  const onDateChange = (field, value) => {
    setFilterDraft((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const branchText = (p) =>
    p.isGlobal
      ? 'All branches'
      : (p.branches || [])
          .map(
            (id) =>
              branchNames.find((b) => String(b._id) === String(id))?.name ||
              'Branch'
          )
          .join(', ');

  // editing needs the full promo (with the names behind its ids), which the list does not carry
  const openEdit = async () => {
    const res = await fetchPromoByIdService(selectedId);
    if (res.error) return setError(String(res.error));
    setForm({ promo: res.data });
  };

  return (
    <div className="">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Customer Rewards'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full relative">
        <div className="min-w-fit absolute left-0 top-0 z-50">
          <SideBar
            selectedSubMenu="customer-rewards"
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
            sideBarSubmenus={MY_CUSTOMER_SUBMENUS}
          />
        </div>
        <div className="flex flex-col h-full w-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-4">
            <div
              className="flex gap-1 border-b border-gray-border"
              role="tablist"
            >
              {TABS.map((t) => (
                <button
                  key={t.value}
                  role="tab"
                  aria-selected={tab === t.value}
                  onClick={() => {
                    setTab(t.value);
                  }}
                  className={`px-4 py-2 text-sm flex items-center gap-2 ${
                    tab === t.value
                      ? 'border-b-2 border-brand-blue text-brand-blue font-semibold'
                      : 'text-text-gray'
                  }`}
                >
                  {t.label}
                  {t.value === 'flagged-claims' && openFlagCount > 0 && (
                    <span
                      className="min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center justify-center"
                      aria-label={`${openFlagCount} open flagged claims`}
                    >
                      {openFlagCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {!options && !error ? (
              <Spinner />
            ) : (
              options && (
                <>
                  {tab === 'list-promos' && (
                    <PromosList
                      options={options}
                      setOpenStatusesDropDown={setOpenStatusesDropDown}
                      filterDraft={filterDraft}
                      openStatusesDropDown={openStatusesDropDown}
                      onStatusChange={onStatusChange}
                      PROMO_STATUSES={PROMO_STATUSES}
                      onDateChange={onDateChange}
                      applyFilter={applyFilter}
                      loading={loading}
                      promos={promos}
                      error={error}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      PHASE={PHASE}
                      branchText={branchText}
                      resetFilter={resetFilter}
                      setForm={setForm}
                    />
                  )}
                  {tab === 'flagged-claims' && (
                    <FlaggedRedemptions
                      data={flaggedCustomerClaims}
                      setData={setFlaggedCustomerClaims}
                      onOpenCountChange={setOpenFlagCount}
                    />
                  )}
                  {tab === 'claims-report' && <RewardsGivenReport />}
                </>
              )
            )}
          </div>
          <div className="sticky bottom-0">
            <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>

      {selectedId && (
        <div
          className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-end items-center"
          onClick={() => setSelectedId(null)}
        >
          <PromoDetailSideView
            key={`${selectedId}-${reload}`}
            promoId={selectedId}
            currency={options.currency}
            onClose={() => setSelectedId(null)}
            onEdit={openEdit}
            onChanged={refresh}
            onDeleted={() => {
              setSelectedId(null);
              refresh();
            }}
          />
        </div>
      )}

      {form && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[60] flex justify-center items-center">
          <PromoFormModal
            promo={form.promo}
            options={options}
            onClose={() => setForm(null)}
            onSaved={(saved) => {
              setForm(null);
              if (!form.promo && saved) setSelectedId(saved._id);
              refresh();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerRewards;
