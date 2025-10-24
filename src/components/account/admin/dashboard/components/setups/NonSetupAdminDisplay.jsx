'use client';
import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';
import Spinner from '@/components/account/Spinner';

const NonSetupAdminDisplay = ({ loading }) => {
  const { user, logOut } = useAuth();

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-background-1 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image
              src="/assets/warning.png"
              alt="Setup Pending"
              width={80}
              height={80}
              className="opacity-70"
            />
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            System Setup Required
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Hi {user?.fullName || 'there'}! Your business account needs to be configured before you can access your account dashboard.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Action Required:</strong> Please contact your system administrator to complete the initial setup process.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Contact your administrator or our support team:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Image src="/assets/email.png" alt="Email" width={16} height={16} />
                Contact Smartco Support team
              </a>
            </div>
          </div>
        </div>

        {/* Logout Option */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={() => logOut()}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Sign out of your account
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonSetupAdminDisplay;