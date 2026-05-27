import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import CreateNewTaxBand from './components/CreateNewTaxBand';

const CreateNewTaxBandPage = () => {
  const pageDescription =
    'This page allows you to create new tax band. Note that any branch under a tax band has a tax rate that applies to the products in that branch, unless a specific product has its own tax rate defined, in which case the product-specific tax rate will be in addition to the branch tax rate. If a product is marked as tax-exempt, then no tax will be applied to that product regardless of the tax rates defined in the tax bands.';

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
        <CreateNewTaxBand pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CreateNewTaxBandPage;
