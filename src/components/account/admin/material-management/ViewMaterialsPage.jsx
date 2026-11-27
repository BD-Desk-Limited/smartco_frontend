'use client';
import React from 'react';
import ViewMaterial from './components/ViewMaterials';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const ViewMaterialPage = () => {

  const pageDescription =
    'The Material Management page allows you to view all materials, edit and delete existing materials, and see detailed information about each material. This interface provides a comprehensive overview of all materials in your store(s), enabling efficient management and updates. You can click on any material to view its details, including its name, description, stock balance and associated metadata. Additionally, you have the option to edit material information or delete materials that are no longer needed. Use the search and filter functionalities to quickly find specific materials.';

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
        <ViewMaterial pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default ViewMaterialPage;
