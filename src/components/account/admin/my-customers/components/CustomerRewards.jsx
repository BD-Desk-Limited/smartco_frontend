import Header from '@/components/account/AdminHeader';
import React, { useEffect, useState } from 'react';
import SubHeader from '../../SubHeader';
import SideBar from '../../SideBar';
import MY_CUSTOMER_SUBMENUS from './MY_CUSTOMER_SUBMENUS';
import PageDescription from '@/components/account/PageDescription';
import Spinner from '@/components/account/Spinner';
import {
  fetchPromoByIdService,
  fetchPromoOptionsService,
  fetchPromosService,
} from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';
import { FaGift } from 'react-icons/fa';
import PromoDetailSideView, { PHASE } from './PromoDetailSideView';
import PromoFormModal from './PromoFormModal';

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
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null); // null | { promo } (promo null = create)

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
    const fetch = () => {
      let cancelled = false;
      fetchPromosService().then((res) => {
        if (cancelled) return;
        if (res.error) setError(String(res.error));
        else {
          setError('');
          setPromos(res.data.promos);
          setBranchNames(res.data.branchNames || []);
        }
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [reload]);

  const refresh = () => setReload((r) => r + 1);
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
    <div>
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
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-4 text-sm text-text-gray">
            <div className="flex items-center justify-between">
              <p>
                {options.permissions.canManage
                  ? 'Promos reward customers automatically when they meet your rules. Redeeming happens at the till.'
                  : 'Promos running for your branches, and the customers who earned them.'}
              </p>
              {options.permissions.canManage && (
                <button
                  onClick={() => setForm({ promo: null })}
                  className="p-2 shadow-md bg-brand-blue text-text-white rounded-md hover:bg-blue-shadow1 whitespace-nowrap flex flex-row gap-1"
                >
                  {' '}
                  <FaGift />
                  Create New promo
                </button>
              )}
            </div>

            {error && <p className="text-error">{error}</p>}
            {!promos && !error ? (
              <Spinner />
            ) : (
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin my-2">
                {promos?.length ? (
                  <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 xl:grid-cols-3">
                    {promos.map((p) => {
                      const isSelected = selectedId === p._id;

                      return (
                        <button
                          key={p._id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedId(p._id)}
                          className={`group w-full overflow-hidden rounded-xl text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 ${
                            isSelected
                              ? 'border-brand-green ring-2 ring-green-shadow9'
                              : 'border-green-shadow8'
                          } bg-green-shadow8`}
                        >
                          <div className="bg-green-shadow3 px-5 py-4 relative text-text-black">
                            {
                              <span
                                className={`px-2 py-1 rounded-full shadow-sm absolute top-1 right-1 ${PHASE[p.phase].style}`}
                              >
                                {PHASE[p.phase].label}
                              </span>
                            }
                            <div className="break-words flex flex-row gap-1 items-center">
                              <FaGift className="text-base" />
                              <h2 className="text-base font-semibold uppercase tracking-widest ">
                                {p.name}
                              </h2>
                            </div>
                          </div>

                          <div className="relative bg-green-shadow7 px-5 py-4">
                            <div
                              aria-hidden="true"
                              className="absolute -left-2 top-0 h-4 w-4 -translate-y-1/2 rounded-full border border-gray-shadow8 bg-white"
                            />
                            <div
                              aria-hidden="true"
                              className="absolute -right-2 top-0 h-4 w-4 -translate-y-1/2 rounded-full border border-gray-shadow8 bg-white"
                            />
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-black">
                              Your customers get:
                            </p>
                            <p className="mt-1 min-h-12 break-words text-base font-mono text-brand-green">
                              {p.offer.description}
                            </p>

                            <div className="my-4 border-t-2 border-dashed border-brand-green" />

                            <div className="space-y-2 text-xs text-text-gray">
                              <div className="flex justify-between gap-3">
                                <span className=" text-text-black">
                                  Period:
                                </span>
                                <span className=" font-semibold text-right text-text-black">
                                  {formatDate(new Date(p.startsAt))} to{' '}
                                  {formatDate(new Date(p.endsAt))}
                                </span>
                              </div>
                              <div className=" flex justify-between gap-3">
                                <span className="text-text-black">
                                  Branches:
                                </span>
                                <span className="font-semibold text-right text-text-black">
                                  {branchText(p)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 divide-x divide-gray-shadow8 rounded-lg bg-gray-shadow10 py-3 text-center">
                              <div className="px-2">
                                <p className="text-lg font-bold text-brand-green">
                                  {p.awardedCount}
                                  {p.limits.maxTotal
                                    ? ` / ${p.limits.maxTotal}`
                                    : ''}
                                </p>
                                <p className="text-xs text-brand-green">
                                  Given
                                </p>
                              </div>
                              <div className="px-2">
                                <p className="text-lg font-bold text-error">
                                  {p.redeemedCount}
                                </p>
                                <p className="text-xs text-error">Used</p>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-[30vh] items-center justify-center text-center font-semibold">
                    No promos yet.
                  </div>
                )}
              </div>
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
