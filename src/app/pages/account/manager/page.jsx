// @home, dashboard
'use client';

import ManagerDashboard from '@/components/account/manager/ManagerDashboard';
import { PageAccessRequirement } from '@/components/account/common/PageAccessRequirement';

const Page = () => {
  // manager pages are for managers only (admins have their own pages)
  const accessCheckFailed = PageAccessRequirement('manager', '');
  if (accessCheckFailed) return accessCheckFailed;
  return <ManagerDashboard />;
};

export default Page;
