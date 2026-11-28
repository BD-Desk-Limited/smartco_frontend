'use client';
import React from 'react';
import ViewGroupedMaterials from './components/groupedMaterials/ViewGroupedMaterials';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';

const ViewGroupedMaterialPage = () => {
  const pageDescription =
    'The Grouped Materials Management page allows you to view all grouped materials, edit and delete existing groups, and see detailed information about each group. This interface provides a comprehensive overview of all grouped materials in your store(s), enabling efficient management and updates. You can click on any group to view its details, including its name, description, associated materials, and metadata. Additionally, you have the option to edit group information or delete groups that are no longer needed. Use the search and filter functionalities to quickly find specific grouped materials.';

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
        <ViewGroupedMaterials pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default ViewGroupedMaterialPage;
