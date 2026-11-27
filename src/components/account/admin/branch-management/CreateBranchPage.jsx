import React from 'react';
import CreateBranch from './components/CreateBranch';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const CreateBranchPage = () => {

  const pageDescription =
    'The Create Branch page allows you to add a new branch to your company. This interface enables you to input essential branch details such as name, location, and associated metadata. Additionally, you can assign the branch to a specific band, which is used to monitor groups of branches with similar attributes, such as sales price of their products, etc. This functionality ensures efficient organization and management of branches within your company.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement('admin', 'Branch_Management');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <CreateBranch pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CreateBranchPage;
