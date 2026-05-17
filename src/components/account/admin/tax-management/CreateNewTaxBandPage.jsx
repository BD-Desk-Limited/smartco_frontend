import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import CreateNewTaxBand from './components/CreateNewTaxBand';

const CreateNewTaxBandPage = () => {
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
        <CreateNewTaxBand pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CreateNewTaxBandPage;
