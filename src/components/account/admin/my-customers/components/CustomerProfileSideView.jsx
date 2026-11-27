import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  FaCheck,
  FaEnvelope,
  FaTimes,
  FaUser,
  FaUserPlus,
} from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import {
  addGroupMembersService,
  fetchComposeOptionsService,
  fetchCustomerProfileService,
  fetchCustomerTransactionsService,
  fetchGroupsService,
} from '@/services/customerServices';
import { formatDate } from '@/utilities/formatTime';
import CustomerOverview from './CustomerOverviewTab';
import CustomerPurchases from './CustomerPurchasesTab';
import MessageComposer from './MessageComposer';

const actionBtn =
  'flex items-center gap-1 px-2 py-1 rounded-md border border-gray-border text-xs font-medium text-text-gray hover:border-brand-blue hover:text-brand-blue disabled:opacity-50';

// "Add to group" button with a menu of the groups this user can add customers to
const AddToGroupMenu = ({ customerId, memberOf, onAdded }) => {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState(null);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const ref = useRef(null);

  // load the groups the first time the menu opens
  useEffect(() => {
    if (!open || groups) return;
    let cancelled = false;
    fetchGroupsService().then((res) => {
      if (cancelled) return;
      if (res.error) setError(String(res.error));
      else setGroups(res.data?.groups || []);
    });
    return () => {
      cancelled = true;
    };
  }, [open, groups]);

  // close when clicking anywhere else
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const memberIds = new Set(memberOf.map((g) => String(g._id)));
  const choices = (groups || []).filter(
    (g) => g.canManage && !memberIds.has(String(g._id))
  );

  const add = async (group) => {
    setBusyId(group._id);
    setError('');
    const res = await addGroupMembersService(group._id, [customerId]);
    setBusyId('');
    if (res.error) return setError(String(res.error));
    onAdded({ _id: group._id, name: group.name });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={actionBtn}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <FaUserPlus /> Add to group
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-64 max-h-72 overflow-y-auto scrollbar-thin bg-text-white border border-gray-border rounded-md shadow-lg z-50 text-sm font-normal">
          {error && <p className="text-error text-xs p-2">{error}</p>}
          {!groups && !error ? (
            <p className="p-3 text-text-gray">Loading groups...</p>
          ) : groups && choices.length === 0 ? (
            <p className="p-3 text-text-gray">
              {groups.length === 0
                ? 'No groups yet. Create one under Customer Groups.'
                : 'Already in every group you can manage.'}
            </p>
          ) : (
            <ul>
              {choices.map((g) => (
                <li key={g._id}>
                  <button
                    type="button"
                    disabled={!!busyId}
                    onClick={() => add(g)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 disabled:opacity-50 flex justify-between gap-2"
                  >
                    <span className="truncate text-text-black">{g.name}</span>
                    <span className="text-xs text-text-gray whitespace-nowrap">
                      {busyId === g._id ? 'Adding...' : `${g.memberCount}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// full message composer for this one customer, in a modal above the panel
const MessageCustomerModal = ({ customer, onClose, onSent }) => {
  const [options, setOptions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchComposeOptionsService().then((res) => {
      if (cancelled) return;
      if (res.error) setError(String(res.error));
      else setOptions(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // portal: the panel is animated with a transform, which would trap a fixed overlay inside it
  return createPortal(
    <div
      className="fixed inset-0 z-[70] bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-text-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin p-4 flex flex-col gap-3"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-black">
            Message {customer.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full bg-brand-gray hover:bg-error text-text-white"
          >
            <FaTimes />
          </button>
        </div>
        {error ? (
          <p className="text-error text-sm">{error}</p>
        ) : !options ? (
          <Spinner />
        ) : (
          <MessageComposer
            options={options}
            fixedCustomer={customer}
            onSent={onSent}
          />
        )}
      </div>
    </div>,
    document.body
  );
};

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

  // header actions
  const [messaging, setMessaging] = useState(false);
  const [addedGroups, setAddedGroups] = useState([]); // groups joined from this panel, shown straight away
  const [notice, setNotice] = useState('');

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
  const groups = [
    ...(header.groups || []),
    ...addedGroups.filter(
      (a) => !(header.groups || []).some((g) => String(g._id) === String(a._id))
    ),
  ];
  const customerRef = {
    _id: customer._id,
    name: header.name,
    customerNumber: header.customerNumber,
  };
  const s = profile?.stats;

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-full md:w-2/3 h-full bg-text-white flex flex-col px-4 pb-4 text-sm text-text-gray gap-4 overflow-y-auto scrollbar-thin md:rounded-l-lg"
    >
      {/* identity: name and number only, never contact details */}
      <div className=" sticky top-0 bg-text-white shadow-sm px-1 pt-4">
        <div className="absolute top-2 right-0 z-50 p-2 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer">
          <FaTimes className="text-text-white" onClick={onClose} />
        </div>
        <div className="pr-8 text-text-black py-4">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold flex flex-row items-baseline gap-2">
              <FaUser /> <span>{header.name}</span>
            </h3>
            <div className="flex flex-row items-center gap-2">
              <button
                type="button"
                className={actionBtn}
                onClick={() => {
                  setNotice('');
                  setMessaging(true);
                }}
              >
                <FaEnvelope /> Message
              </button>
              <AddToGroupMenu
                customerId={customer._id}
                memberOf={groups}
                onAdded={(g) => {
                  setAddedGroups((prev) => [...prev, g]);
                  setNotice(`Added to ${g.name}.`);
                }}
              />
            </div>
          </div>
          {notice && (
            <p className="text-xs text-brand-green flex items-center gap-1 mt-1">
              <FaCheck /> {notice}
            </p>
          )}
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

        <div className="flex gap-1 border-b border-gray-border overflow-x-auto no-scrollbar" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 whitespace-nowrap shrink-0 ${
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

      {messaging && (
        <MessageCustomerModal
          customer={customerRef}
          onClose={() => setMessaging(false)}
          onSent={(campaign, message) => {
            setMessaging(false);
            setNotice(message || 'Your message is being sent.');
          }}
        />
      )}
    </motion.div>
  );
};

export default CustomerProfileSideView;
