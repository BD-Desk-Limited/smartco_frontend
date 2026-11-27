import React from 'react';
import BulkUploadReview from './components/BulkUploadReview';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const BulkUploadReviewPage = () => {

  const pageDescription =
    'The bulk upload review page provides you with a comprehensive interface for reviewing the materials you have uploaded in bulk. It includes options for specifying material details, creating new categories and units if they are not available, and saving the new material. Additionally, it offers a bulk upload option for users who need to add multiple materials at once. These materials can be used to create new products, and they will be available for selection in the product creation page, alongside any grouped materials.';

  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Materials_Management'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <BulkUploadReview pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default BulkUploadReviewPage;
