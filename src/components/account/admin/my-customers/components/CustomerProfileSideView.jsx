import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaUser } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import {
  fetchCustomerProfileService,
  fetchCustomerTransactionsService,
} from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';
import CustomerOverview from './CustomerOverviewTab';
import CustomerPurchases from './CustomerPurchasesTab';

const StatCard = ({ label, value, hint }) => (
  <div className="border border-gray-border rounded-md p-3 flex flex-col">
    <span className="text-xs">{label}</span>
    <span className="text-lg font-semibold text-text-black">{value}</span>
    {hint && <span className="text-xs">{hint}</span>}
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="border border-gray-border rounded-md p-3">
    <h4 className="font-semibold text-text-black mb-2">{title}</h4>
    <div style={{ width: '100%', height: 260 }}>{children}</div>
  </div>
);

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'purchases', label: 'Purchases' },
];

const CustomerProfileSideView = ({ customer, onClose }) => {
  const [tab, setTab] = useState('overview');
  const [months, setMonths] = useState(12);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // purchases tab
  const [dates, setDates] = useState({ from: '', to: '' });
  const [appliedDates, setAppliedDates] = useState({ from: '', to: '' });
  const [txPage, setTxPage] = useState(1);
  const [tx, setTx] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      let cancelled = false;
      setLoading(true);
      setError('');
      const body = { customerId: customer._id, months: months };
      await fetchCustomerProfileService(body).then((res) => {
        if (cancelled) return;
        if (res.error) setError(String(res.error));
        else setProfile(res.data);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    };

    fetch();
  }, [customer._id, months]);

  useEffect(() => {
    const fetch = async () => {
      if (tab !== 'purchases') return;
      let cancelled = false;
      setTxLoading(true);
      setTxError('');
      const body = {
        customerId: customer._id,
        ...appliedDates,
        page: txPage,
        limit: 15,
      };
      await fetchCustomerTransactionsService(body).then((res) => {
        if (cancelled) return;
        if (res.error) setTxError(String(res.error));
        else setTx(res.data);
        setTxLoading(false);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [tab, customer._id, appliedDates, txPage]);

  const header = profile?.customer || customer;
  const registeredAt = header.registeredBranch?.name;
  const groups = header.groups || [];
  const s = profile?.stats;

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-2/3 h-full bg-text-white flex flex-col px-4 pb-4 text-sm text-text-gray gap-4 overflow-y-auto scrollbar-thin rounded-l-lg"
    >
      {/* identity: name and number only, never contact details */}
      <div className=" sticky top-0 bg-text-white shadow-sm px-1 pt-4">
        <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer">
          <FaTimes className="text-text-white" onClick={onClose} />
        </div>
        <div className="pr-8 text-text-black py-4">
          <h3 className="text-lg font-semibold flex flex-row items-baseline gap-2">
            {' '}
            <FaUser /> <span>{header.name}</span>
          </h3>
          <p>
            <span className="font-semibold">{header.customerNumber}</span>
            {registeredAt ? ` · Registered at ${registeredAt}` : ''}
            {header.createdAt
              ? ` · Registered ${formatDate(new Date(header.createdAt))}`
              : ''}
          </p>
          {groups.length > 0 && (
            <p>Groups: {groups.map((g) => g.name).join(', ')}</p>
          )}
        </div>

        <div className="flex gap-1 border-b border-gray-border" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 ${
                tab === t.value
                  ? 'border-b-2 border-brand-blue text-brand-blue font-semibold'
                  : 'text-text-gray'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- overview ---------------- */}
      {tab === 'overview' &&
        (loading ? (
          <Spinner />
        ) : error ? (
          <p className="text-error">{error}</p>
        ) : (
          <CustomerOverview
            profile={profile}
            StatCard={StatCard}
            s={s}
            setMonths={setMonths}
            ChartCard={ChartCard}
            header={header}
            months={months}
          />
        ))}

      {/* ---------------- purchases ---------------- */}
      {tab === 'purchases' && (
        <CustomerPurchases
          txPage={txPage}
          tx={tx}
          setTxPage={setTxPage}
          txError={txError}
          setAppliedDates={setAppliedDates}
          dates={dates}
          setDates={setDates}
          txLoading={txLoading}
        />
      )}
    </motion.div>
  );
};

export default CustomerProfileSideView;
