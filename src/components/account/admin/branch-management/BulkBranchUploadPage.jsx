import React from 'react';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';
import BulkBranchUpload from './components/BulkBranchUpload';

const BulkBranchUploadPage = () => {
  const pageDescription = `The Bulk Branch Creation page provides you with a template for adding multiple branches to your company at once. This is useful for users who need to add a large number of branches quickly. The template includes fields for specifying branch details such as name, address, branch ID, email, phone number, band, tax band, opening hour, and closing hour. Once the template is filled, it can be uploaded to the system, and the branches will be added to your company.`;

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement('admin', 'Branch_Management');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <BulkBranchUpload pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default BulkBranchUploadPage;
