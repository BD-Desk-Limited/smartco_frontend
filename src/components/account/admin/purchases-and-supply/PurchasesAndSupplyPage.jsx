import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import PurchasesAndSupply from './components/PurchasesAndSupply';

const PurchasesAndSupplyPage = () => {
  const pageDescription =
    'This page allows you to manage purchases and supply. You can view purchase orders, manage suppliers, track inventory levels, and perform other administrative tasks related to purchases and supply management. Supply are materials that come in from suppliers, vendors, or open market. Purchases are the act of buying or acquiring goods or services from suppliers, vendors, or other sources. This does not include materials from established branch locations within your organization. Materials from established branch locations within your organization are considered inter-branch transfers, and should be managed through the inter-branch transfers section.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Purchases_And_Supply'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar selectedMenu="purchases-and-supply" />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <PurchasesAndSupply pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default PurchasesAndSupplyPage;
