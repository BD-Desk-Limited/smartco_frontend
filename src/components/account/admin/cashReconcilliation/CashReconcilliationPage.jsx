'use client';

import React, { Suspense } from 'react';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import Header from '@/components/account/admin/shell/AdminHeader';
import SubHeader from '@/components/account/admin/shell/SubHeader';
import { PageAccessRequirement } from '@/components/account/common/PageAccessRequirement';
import CashReconciliation from '@/components/account/common/cash-reconciliation/CashReconciliation';

const FinanceCashReconciliation = () => {
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Finance_Management'
  );
  if (accessCheckFailed) return accessCheckFailed;
  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="w-full sticky top-0 z-[60]">
        <Header />
      </div>
      <SubHeader
        FirstComponents={<FaMoneyCheckAlt className="mx-1 text-text-gray" />}
        title="Finance · Cash reconciliation"
      />
      <Suspense fallback={<div className="p-6 text-sm">Loading…</div>}>
        <CashReconciliation side="finance" />
      </Suspense>
    </div>
  );
};

export default FinanceCashReconciliation;
