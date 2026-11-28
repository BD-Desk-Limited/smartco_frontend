'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaCashRegister,
  FaDatabase,
  FaExclamationCircle,
  FaMoneyCheckAlt,
} from 'react-icons/fa';
import { useAuth } from '@/contexts/authContext';
import Greeting from '@/components/account/admin/dashboard/components/Greeting';
import PageDescription from '@/components/account/common/PageDescription';
import { listDeclarations } from '@/services/cashDeclarationServices';
import { ymd } from '@/components/account/common/cash-reconciliation/cashRecHelpers';
import { MANAGER_BASE_PATH } from './shell/MANAGER_MENU';

const CASH_REC = `${MANAGER_BASE_PATH}/cash-reconciliation`;

// Shortcuts to the jobs managers do every day.
const QUICK_ACTIONS = [
  {
    label: 'Declare banking',
    href: CASH_REC,
    Icon: FaMoneyCheckAlt,
  },
  {
    label: 'Sales point',
    href: '/pages/account/sales-point',
    Icon: FaCashRegister,
  },
  {
    label: 'Unsynced data',
    href: `${MANAGER_BASE_PATH}/local-data-management`,
    Icon: FaDatabase,
  },
];

// the banking statuses a manager has to act on, and the ones waiting on someone else
const BANKING_TILES = [
  {
    status: 'changes_requested',
    label: 'Sent back by finance',
    tone: 'border-red-300 bg-red-50 text-red-800',
    urgent: true,
  },
  {
    status: 'not_started',
    label: 'Not declared yet',
    tone: 'border-amber-300 bg-amber-50 text-amber-800',
    urgent: true,
  },
  {
    status: 'draft',
    label: 'Drafts to submit',
    tone: 'border-blue-300 bg-blue-50 text-blue-800',
    urgent: true,
  },
  {
    status: 'submitted',
    label: 'Waiting on finance',
    tone: 'border-gray-300 bg-white text-gray-800',
  },
  {
    status: 'approved',
    label: 'Approved',
    tone: 'border-green-300 bg-green-50 text-green-800',
  },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return ymd(d);
};

// Banking over the last 7 days, for the manager's branches.
const BankingThisWeek = () => {
  const router = useRouter();
  const [summary, setSummary] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let live = true;
    listDeclarations('manager', { from: daysAgo(6), to: ymd() }).then(
      ({ data, error: err }) => {
        if (!live) return;
        if (err) setError(err);
        else setSummary(data.summary || {});
      }
    );
    return () => {
      live = false;
    };
  }, []);

  const toDo = BANKING_TILES.filter((t) => t.urgent).reduce(
    (n, t) => n + (summary?.[t.status] || 0),
    0
  );

  return (
    <section
      aria-label="Banking, last 7 days"
      className="rounded-xl bg-white border border-gray-border shadow-sm p-3 md:p-4 flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-text-black">Banking, last 7 days</h2>
        {summary && (
          <span
            className={`inline-flex items-center gap-1 text-sm ${toDo ? 'text-red-700' : 'text-green-700'}`}
          >
            {toDo ? <FaExclamationCircle /> : null}
            {toDo
              ? `${toDo} day${toDo === 1 ? '' : 's'} need${toDo === 1 ? 's' : ''} you`
              : 'All up to date'}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {!error && !summary && <p className="text-sm text-text-gray">Loading…</p>}
      {summary && (
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {BANKING_TILES.map((t) => (
            <li key={t.status}>
              <button
                type="button"
                onClick={() => router.push(`${CASH_REC}?status=${t.status}`)}
                className={`w-full rounded-lg border px-3 py-2 text-left hover:shadow-md ${t.tone}`}
              >
                <span className="block text-2xl font-bold">
                  {summary[t.status] || 0}
                </span>
                <span className="block text-xs">{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

// Placeholder dashboard for managers, in the same shape as the admin one.
const ManagerDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="relative bg-background-1 min-h-full w-full">
      <PageDescription pageDescription="Your branches at a glance: what needs doing today, and shortcuts to the jobs you do every day." />
      <Greeting user={user} />

      <section aria-label="Quick actions" className="px-3 md:px-6 pt-4">
        <h2 className="text-sm font-semibold text-text-gray mb-2">
          Quick actions
        </h2>
        <ul className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, href, Icon }) => (
            <li key={href}>
              <button
                type="button"
                onClick={() => router.push(href)}
                className="w-full min-h-20 rounded-xl bg-white border border-gray-border shadow-sm flex flex-col items-center justify-center gap-2 p-3 text-sm text-text-black hover:border-brand-green hover:shadow-md active:bg-gray-shadow10"
              >
                <Icon className="text-xl text-brand-green" />
                <span className="text-center leading-tight">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="px-3 md:px-6 pt-4">
        <BankingThisWeek />
      </div>

      <div className="flex flex-col gap-3 md:gap-5 w-full items-center justify-center text-center px-4 py-12 md:py-20">
        <p className="text-2xl md:text-4xl font-mono text-brand-green">
          Welcome to your dashboard
        </p>
        <p className="text-base md:text-xl font-mono">
          Watch this space: sales, stock and staff for your branches are coming
          here soon.
        </p>
        <p className="text-base md:text-xl font-mono">
          For now, you can explore the existing features and give feedback.
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
