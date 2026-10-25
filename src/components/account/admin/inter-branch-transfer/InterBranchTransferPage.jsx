import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import StockTransfers from './components/StockTransfers';

const InterBranchTransferPage = () => {
  const pageDescription = ' ';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Inter_Branch_Transfers'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar selectedMenu="reports" />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <StockTransfers pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default InterBranchTransferPage;
