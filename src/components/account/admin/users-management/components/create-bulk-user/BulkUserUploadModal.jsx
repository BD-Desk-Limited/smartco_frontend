import Image from 'next/image';
import {useRouter} from 'next/navigation';
import React from 'react'


const BulkUserUploadModal = () => {
    const Router = useRouter();
  return (
      <div className="bg-text-white rounded-md flex flex-col justify-center items-center w-[calc(100%-1rem)] max-w-lg lg:w-[35vw] lg:max-w-none">
        <h1 className="bg-brand-blue w-full text-center text-text-white rounded-t-md min-h-12 py-3 px-3 flex justify-center items-center">
          Bulk Users Upload
        </h1>
        <div className="min-h-[45vh] py-6 flex flex-col justify-center items-center gap-6 md:gap-10 w-full px-4 md:px-10">
          <p className="w-full text-center">
            For fast and seamless creation of users in bulk, we have provided
            a template for you to fill and upload
          </p>
          <p className="w-full text-center text-error italic">
            Warning: Do not alter any part of the headings, and ensure the correct
            template is used.
          </p>
          <div className="w-full flex flex-row flex-wrap justify-center gap-3 md:gap-5 text-sm">
            <a
              onClick={() => Router.push('/pages/account/admin/users-management/create-bulk-user')}
              href="/documents/smartco_users_upload_sheet.xlsx"
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
              onClick={() => Router.push('/pages/account/admin/users-management/create-bulk-user')}
              className="border border-brand-blue text-brand-blue rounded-md px-5 py-2 hover:bg-brand-blue hover:text-text-white"
            >
              Already have a template
            </button>
          </div>
        </div>
        <div className="bg-brand-blue w-full text-center text-text-white rounded-b-md min-h-12 py-3 px-3 flex justify-center items-center"></div>
      </div>
  )
}

export default BulkUserUploadModal;