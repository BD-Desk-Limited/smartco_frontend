'use client';
// @search banking, cash declaration, proof of payment, cash reconciliation
import React, { Suspense } from 'react';
import CashReconciliation from '@/components/account/common/cash-reconciliation/CashReconciliation';
import { PageAccessRequirement } from '@/components/account/common/PageAccessRequirement';

const Page = () => {
  // manager pages are for managers only (finance admins use the admin page)
  const accessCheckFailed = PageAccessRequirement('manager', '');
  if (accessCheckFailed) return accessCheckFailed;
  return (
    <Suspense fallback={<div className="p-6 text-sm">Loading…</div>}>
      <CashReconciliation side="manager" />
    </Suspense>
  );
};

export default Page;
