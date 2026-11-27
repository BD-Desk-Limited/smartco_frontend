'use client';
import React from 'react';
import CreateGroupedMaterial from './components/groupedMaterials/CreateGroupedMaterial';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const CreateGroupedMaterialPage = () => {

  const pageDescription =
    'The Grouped Material Creation page allows you to combine different materials to form a new grouped material. This interface provides options for selecting existing materials, specifying the quantities needed for the new grouped material, and saving the grouped material. These grouped materials can be used to create new products or other grouped materials and will not be available for sales over the counter. They are used internally for inventory management and production planning and will only be available for selection in the product creation page.';

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
        <CreateGroupedMaterial pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CreateGroupedMaterialPage;
