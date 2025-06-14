import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BulkBranchUploadModal = () => {
  const Router = useRouter();

  return (
    <div className="bg-text-white rounded-md flex flex-col justify-center items-center w-[35vw]">
      <h1 className="bg-brand-blue w-full text-center text-text-white rounded-t-md h-[8vh] flex justify-center items-center">
        Bulk Branches Upload
      </h1>
      <div className="h-[45vh] flex flex-col justify-center items-center gap-10 w-full px-10">
        <p className="w-full text-center">
          For fast and seamless creation of branches in bulk, we have provided
          a template for you to fill and upload
        </p>
        <p className="w-full text-center text-error italic">
          Warning: Do not alter any part of the headings, and ensure the correct
          template is used.
        </p>
        <div className="w-full flex flex-row justify-center gap-5 text-sm">
          <a
            onClick={() => Router.push('/pages/account/admin/branch-management/create-branch/bulk')}
            href="/documents/smartco_branch_upload_sheet.xlsx"
            download
            className="bg-brand-blue text-text-white rounded-md px-5 py-2 flex flex-row justify-center items-center gap-2 hover:bg-blue-shadow5"
          >
            <Image
              src="/assets/download.png"
              width={15}
              height={15}
              alt="Download"
            />
            Download Template
          </a>
          <button
            onClick={() => Router.push('/pages/account/admin/branch-management/create-branch/bulk')}
            className="border border-brand-blue text-brand-blue rounded-md px-5 py-2 hover:bg-brand-blue hover:text-text-white"
          >
            Already have a template
          </button>
        </div>
      </div>
      <div className="bg-brand-blue w-full text-center text-text-white rounded-b-md h-[8vh] flex justify-center items-center"></div>
    </div>
  );
};

export default BulkBranchUploadModal;