import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import NewPurchaseRecord from './components/purchases/NewPurchaseRecord';

const NewPurchaseRecordPage = () => {
  const pageDescription =
    'Create and manage new purchase orders by selecting suppliers, specifying destinations, and adding purchase items to the order. Purchases are materials that come in from suppliers, vendors, or open market. Purchases are the act of buying or acquiring goods or services from suppliers, vendors, or other sources. This does not include materials from established branch locations within your organization. Materials from established branch locations within your organization are considered inter-branch transfers, and should be managed through the inter-branch transfers section.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Purchases_And_Supply'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 relative">
      <div>
        <AdminSideBar selectedMenu="purchases-and-supply" />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <NewPurchaseRecord pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default NewPurchaseRecordPage;
