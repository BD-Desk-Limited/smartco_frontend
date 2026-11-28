import React from 'react';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';
import BulkBranchesUploadReview from './components/BulkBranchesUploadReview';

const BulkBranchUploadReviewPage = () => {
  const pageDescription =
    'The bulk branch upload review page provides you with a comprehensive interface for reviewing the branches you have uploaded in bulk. It includes options for specifying branch details such as name, address, branch ID, email, phone number, band, tax band, opening hour, and closing hour. Additionally, it offers a bulk upload option for users who need to add multiple branches at once. These branches can be managed and updated as needed, ensuring accurate and up-to-date branch information.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement('admin', 'Branch_Management');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <BulkBranchesUploadReview pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default BulkBranchUploadReviewPage;
