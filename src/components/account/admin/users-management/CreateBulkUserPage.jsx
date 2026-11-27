import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import BulkUserUpload from './components/create-bulk-user/BulkUserUpload';

const CreateBulkUserPage = () => {

  const pageDescription = `The Bulk User Creation page allows you to add multiple users to your system at once using a template. This is ideal for administrators who need to onboard several users quickly. The template includes fields for user details such as name, email, and role. After filling out the template, you can upload it here to create all the users in one step. Note that only non-administrative users can be created in bulk.`;

  const accessCheckFailed = PageAccessRequirement('admin', 'Users_Management');

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <BulkUserUpload pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default CreateBulkUserPage;
