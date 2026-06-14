import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import NewPurchase from './components/purchases/NewPurchase';

const NewPurchasePage = () => {
  const pageDescription = ' ';

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
        <NewPurchase pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default NewPurchasePage;
