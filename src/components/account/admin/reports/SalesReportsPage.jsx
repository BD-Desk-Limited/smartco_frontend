import React from 'react';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';
import SalesReports from './components/sales-reports/SalesReports';

const SalesReportsPage = () => {
  const pageDescription = '';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement('admin', 'Reports');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <SalesReports pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default SalesReportsPage;
