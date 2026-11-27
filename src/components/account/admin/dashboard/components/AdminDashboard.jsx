import Header from '@/components/account/admin/AdminHeader';
import { useAuth } from '@/contexts/authContext';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FaPlusCircle,
  FaExchangeAlt,
  FaChartLine,
  FaShippingFast,
} from 'react-icons/fa';
import Greeting from './Greeting';
import {
  ADMIN_BASE_PATH,
  ADMIN_MENU,
  canSeeMenu,
} from '../../shell/adminMenu';

// Shortcuts to the jobs admins do on the move. `menu` ties each one to a menu
// item so it follows the same access rules as the sidebar.
const QUICK_ACTIONS = [
  {
    label: 'Record a purchase',
    href: `${ADMIN_BASE_PATH}/purchases/new-purchase`,
    Icon: FaPlusCircle,
    menu: 'purchases-and-supply',
  },
  {
    label: 'Purchase orders',
    href: `${ADMIN_BASE_PATH}/purchases`,
    Icon: FaShippingFast,
    menu: 'purchases-and-supply',
  },
  {
    label: 'Stock transfers',
    href: `${ADMIN_BASE_PATH}/inter-branch-transfers`,
    Icon: FaExchangeAlt,
    menu: 'inter-branch-transfers',
  },
  {
    label: 'Sales report',
    href: `${ADMIN_BASE_PATH}/reports`,
    Icon: FaChartLine,
    menu: 'reports',
  },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  const actions = QUICK_ACTIONS.filter((action) => {
    const menu = ADMIN_MENU.find((m) => m.name === action.menu);
    return menu && canSeeMenu(user, menu);
  });

  return (
    <div className="relative bg-background-1 min-h-full w-full">
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <Greeting user={user} />
      </div>

      {actions.length > 0 && (
        <section aria-label="Quick actions" className="px-3 md:px-6 pt-4">
          <h2 className="text-sm font-semibold text-text-gray mb-2">
            Quick actions
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map(({ label, href, Icon }) => (
              <li key={href}>
                <button
                  type="button"
                  onClick={() => router.push(href)}
                  className="w-full min-h-20 rounded-xl bg-white border border-gray-border shadow-sm flex flex-col items-center justify-center gap-2 p-3 text-sm text-text-black hover:border-brand-blue hover:shadow-md active:bg-gray-shadow10"
                >
                  <Icon className="text-xl text-brand-blue" />
                  <span className="text-center leading-tight">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-3 md:gap-5 w-full items-center justify-center text-center px-4 py-12 md:py-24">
        <p className="text-2xl md:text-4xl font-mono text-brand-green">
          Welcome to your dashboard
        </p>
        <p className="text-base md:text-xl font-mono">
          Watch this space, fantastic functionalities are coming-up soonest!!!
          You will love it
        </p>
        <p className="text-base md:text-xl font-mono">
          For now, you can explore the existing features and provide feedback.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
