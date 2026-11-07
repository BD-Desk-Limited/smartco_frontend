'use client';
import React from 'react';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
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
    <div className="flex flex-row gap-0 bg-background-1">
      <div>
        <AdminSideBar selectedMenu="my-customers" />
      </div>
      <div className="w-full max-h-[100vh] overflow-y-auto no-scrollbar">
        <MessageCustomer pageDescription={pageDescription} />
      </div>
    </div>
  );
};

export default MessageCustomerPage;
