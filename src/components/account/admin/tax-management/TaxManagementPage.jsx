import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import TaxManagement from './components/TaxManagement';

const TaxManagementPage = () => {
  const pageDescription = '';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement('admin', 'Tax_Management');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar selectedMenu="tax-management" />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <TaxManagement pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default TaxManagementPage;
