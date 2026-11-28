import React from 'react';
import CreateMaterial from './components/CreateMaterial';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';

const ManageMaterial = () => {
  const pageDescription =
    'The Material Onboarding page provides you with a comprehensive interface for adding new materials to your store(s). It includes options for specifying material details, creating new categories and units if they are not available, and saving the new material. Additionally, it offers a bulk upload option for users who need to add multiple materials at once. These materials can be used to create new products, and they will be available for selection in the product creation page, alongside any grouped materials.';

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
        <CreateMaterial pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default ManageMaterial;
