'use client';
import React from 'react';
import { PageAccessRequirement } from '../../common/PageAccessRequirement';
import MessageCustomer from './components/MessageCustomer';

const MessageCustomerPage = () => {
  const pageDescription =
    'This page allows you to send messages to your customers. You can compose a new message or make use of existing templates set by admins, select the recipients, and send it directly from this interface. Please ensure that you have the necessary permissions to access this feature.';

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Customer_Management'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  return (
    <div className="flex flex-row gap-0 bg-background-1 h-full">
      <div className="w-full h-full overflow-y-auto ">
        <MessageCustomer pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default MessageCustomerPage;
