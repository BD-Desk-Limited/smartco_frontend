'use client';
import React from 'react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import { useBulkUserUpload } from '@/contexts/bulkUserUploadContext';
import { verifyEmail, verifyInputText, verifyPhoneNumber } from '@/utilities/verifyInput';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import UsersManagementSidebar from '../UsersManagementSidebar';
import ErrorModal from '@/components/account/ErrorModal';
import SuccessModal from '@/components/account/SuccessModal';
import Image from 'next/image';
import PageDescription from '@/components/account/PageDescription';

const BulkUserUpload = ({pageDescription}) => {

  const selectedSubMenu = {
    staffId: 'Create New User',
    link: '/create-user',
  };
  const [file, setFile] = React.useState(null);
  const [error, setError] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [reviewUpload, setReviewUpload] = React.useState(false);
  const { setBulkUserData, setErrorData, errorData } = useBulkUserUpload();
  const Router = useRouter();  

  const validateFile = (file) => {
    if (!file) return false;
    const validFormats = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validFormats.includes(file.type)) {
      setError('Invalid file format. Please upload a valid excel file.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (validateFile(uploadedFile)) {
      setFile(uploadedFile);
      setError('');
    }
  };

  const collateErrors = (data) => {
    const errors = [];
    data.forEach((user, index) => {
      let error = {
        duplicate: [],
        staffId: [],
        fullName: [],
        email: [],
        role: [],
        branch: [],
        phoneNumber: [],
      }; 

      if (!user.staffId) {
        error.staffId.push({error: `user staffId is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(user.staffId).passed){
        error.staffId.push({error: `${verifyInputText(user.staffId).message} on row ${index + 1}`, row: index + 1});
      };

      if (!user.fullName) {
        error.fullName.push({error: `user full name is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(user.fullName).passed){
        error.fullName.push({error: `${verifyInputText(user.fullName).message} on row ${index + 1}`, row: index + 1});
      };

      if (!user.email) {
        error.email.push({error:`user email is required for row ${index + 1}`, row: index + 1});
      };
      if(!verifyEmail(user.email).passed){
        error.email.push({error:`${verifyEmail(user.email).message} on row ${index + 1}`, row: index + 1});
      };

      if (!['seller', 'manager'].includes(user.role)) {
        error.role.push({error:`user role is required and must be either 'seller' or 'manager' please check your spelling for row ${index + 1}`, row: index + 1});
      };
      if(!verifyInputText(user.role).passed){
        error.role.push({error:`${verifyInputText(user.role).message} on row ${index + 1}`, row: index + 1});
      };

      if (!user.branch || user.branch.length === 0) {
        error.branch.push({error:`user branches are required for row ${index + 1}`, row: index + 1});
      };
      if(!user.branch.every(branch => verifyInputText(branch).passed)){
        
        user.branch.forEach((branch, branchIndex) => {
          if (!verifyInputText(branch).passed) {
            error.branch.push({error:`${verifyInputText(branch).message} for branch name on row ${index + 1}`, row: index + 1});
          }
        });
      };

      if (user.phoneNumber && !verifyPhoneNumber(user.phoneNumber).passed) {
        error.phoneNumber.push({error:`${verifyPhoneNumber(user.phoneNumber).message} on row ${index + 1}`, row: index + 1});
      }

      // Check for duplicate staffId.
      const staffIdDuplicateIndex = data.findIndex((u, i) => u.staffId === user.staffId && i !== index);
      if (user.staffId && staffIdDuplicateIndex !== -1) {
        error.duplicate.push({error:`Duplicate staffId found for row ${index + 1} and ${staffIdDuplicateIndex + 1}`, row: index + 1});
      }

      // Check for duplicate email.
      const emailDuplicateIndex = data.findIndex((u, i) => u.email === user.email && i !== index);
      if (user.email && emailDuplicateIndex !== -1) {
        error.duplicate.push({error:`Duplicate email found for row ${index + 1} and ${emailDuplicateIndex + 1}`, row: index + 1});
      }

      //check for duplicate phoneNumber.
      if (user.phoneNumber) {
        const duplicateIndex = data.findIndex((u, i) => u.phoneNumber === user.phoneNumber && i !== index);
        if (duplicateIndex !== -1) {
          error.duplicate.push({error:`Duplicate phone number found for row ${index + 1} and ${duplicateIndex + 1}`, row: index + 1});
        }
      }
      
      errors.push({ ...error });

    });
    return errors;
  };
  
  const handleUpload = (e) => {
    e.preventDefault();

    try {
      setError('');
      setUploading(true);

      const validFileName = 'smartco_users_upload_sheet'; // Define the file name
      if (file) {
        if (!validateFile(file) || !file.name.includes(validFileName)) {
          setError('File does not meet the required specification. Download required Template');
          setUploading(false);
          return;
        };
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX?.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        // Filter out columns that are "__EMPTY_*"
        const filteredData = jsonData.map((row) => {
          return Object.fromEntries(
            Object.entries(row).filter(([key]) => !key.startsWith("__EMPTY"))
          );
        });

        if(jsonData.length !== 0) {
          const uploadedDataSample = filteredData[0];
          // Check if the uploaded file has the required headings
          const requiredHeadings = [
            'Staff_ID',
            'Full_Name',
            'Email',
            'Role',
            'Branches',
            'Phone_Number',
          ];
          const hasRequiredHeadings = requiredHeadings.every((heading) =>
            Object.keys(uploadedDataSample).includes(heading)
          );

          if (!hasRequiredHeadings) {
            setError(`Please upload the correct Excel file we have provided: "${validFileName}"`);
            setUploading(false);
            return;
          };

          //format data with correct keys
          const usersData = filteredData.map((user) => {
            return {
              staffId: user.Staff_ID || '',
              fullName: user.Full_Name || '',
              email: user.Email || '',
              role: user.Role || '',
              // Convert branches to an array if it's a string, and split by commas and return an array, remove any extra spaces
              branch: user.Branches ? user.Branches.split(',').map(branch => branch.trim()) : [],
              phoneNumber: user.Phone_Number || '',
            };
          });

          //validate all headings are present
          if(!Object.keys(uploadedDataSample).includes(
            'Staff_ID' && 'Full_Name' && 'Email' && 'Role' && 'Branches' && 'Phone_Number'
          )){
            setError(`Please upload the correct Excel file we have provided ${validFileName}`);
            setUploading(false);
            return;
          };

          const collatedErrors = collateErrors(usersData);

          setBulkUserData(usersData);
          setErrorData(collatedErrors);
          setFile(null);
          setError('');
          setUploading(false);
          setReviewUpload(true);

        }else{
          setError('No data found in the uploaded file, please check the file and try again.');
          setUploading(false);
        };  
      };

      reader.onprogress = (data) => {
        if(data.lengthComputable){  
          const progress = Math.round((data.loaded / data.total) * 100);
          setUploadProgress(progress);
        };
      };

      reader.readAsArrayBuffer(file); // Read the file using XLSX
    } catch (error) {
      setError('An error occurred while uploading the file. Please try again.');
      setUploading(false);  
    };
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Bulk Upload Users'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <UsersManagementSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full h-full">
            <div className="bg-background-1 p-5 my-2 mx-5 rounded-md h-full flex flex-col justify-center items-center">
                <div className='bg-text-white p-5 rounded-md min-h-[50vh] w-[40vw] flex flex-col justify-center items-center gap-2'>
                  <h1 className='text-base font-bold'>Bulk Upload users</h1>
                  <span className='text-text-gray text-sm'>create user accounts within your organisation in bulk</span>
                  <span className='text-success font-semibold my-2 text-xs'>Upload your filled excel template</span>
      
                  <div 
                    className="border-2 border-dashed border-gray-border rounded-lg p-6 text-center w-full" 
                    onDrop={handleDrop} 
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {
                      file ? (
                        <div className='flex flex-col items-center gap-2'>
                          <Image src='/assets/excel.png' alt='excel file' width={150} height={150} />
                          <span className='text-text-gray text-sm'>{file.name}</span>
                        </div>
                      ):(
                        <div className='flex flex-col items-center'>
                          <Image src={'/assets/upload.png'} alt='upload file' width={70} height={70} className=''/>
                          <div className="text-text-gray mb-2">Drag and Drop File here</div>
                          <div className="text-text-gray mb-2">or</div>
                          <label className="cursor-pointer inline-block bg-gray-shadow9 hover:bg-gray-shadow7 px-4 py-2 rounded-md text-text-gray">
                            Browse file
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleFileChange}
                              accept=".xls, .xlsx"
                            />
                          </label>
                          <p className="text-sm text-gray-500 mt-2">Maximum file size 10MB</p>
                          <p className="text-sm text-gray-500">Supported formats: xls, xlsx</p>
                        </div>
                      )
                    }
                  </div>
                  {error && <p className="text-error mt-1 text-base text-center">{error}</p>}
                  {!error? 
                    <button 
                      className={`${file ? 'bg-brand-blue hover:bg-blue-shadow5' : 'bg-gray-shadow9'} text-text-white px-6 py-2 rounded-md`} 
                      onClick={handleUpload} 
                      disabled={!file}
                    >
                      Upload
                    </button>:
                    <div className="w-full flex flex-row justify-center gap-5 text-sm">
                      <a
                        onClick={()=>{setFile(null); setError('')}}
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
                        onClick={()=>{setFile(null); setError('')}}
                        className="border border-brand-blue text-brand-blue rounded-md px-5 py-2 hover:bg-brand-blue hover:text-text-white"
                      >
                        Retry upload
                      </button>
                    </div>
                  }
                </div>

                {uploading && 
                  <div className="mb-20 mt-5 flex flex-col justify-center items-center gap-2 w-[40vw]">
                    <div className="text-text-black font-bold text-left text-base w-full">Upload Progress</div>
                    <div className="bg-gray-shadow8 rounded-md w-full p-1 flex flex-row justify-between items-center gap-2">
                      <Image src={'/assets/excel.png'} alt='excel file' width={40} height={40} className=''/>
                      <div className='w-full bg-gray-shadow9 h-1 rounded-full'>
                        <div className="bg-brand-blue h-1 rounded-full" style={{ width: `${uploadProgress}%` }}>
                        </div>
                      </div>
                      <span>{`${uploadProgress}%`}</span>
                    </div>
                  </div>
                }
            </div>
            <PageDescription
              pageDescription={ pageDescription } 
            />
        </div>
      </div>
      {reviewUpload && (
        <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
          {
            errorData.every((error) => Object.values(error).every((value) => value.length === 0)) ? (
              <SuccessModal
                message={'Successful upload'}
                title={'Bulk Upload Materials'}
                buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
                onClose={() => Router.push('/pages/account/admin/users-management/bulk-upload-review')}
                buttonText={'Review Upload'}
                subText={'All userdata has been uploaded successfully'}
              />
            ) : (
              <ErrorModal
                onClose={() => Router.push('/pages/account/admin/users-management/bulk-upload-review')}
                buttonText={'Review Errors'}
                title={'Bulk Upload users Error'}
                subText={'Some rows were not uploaded due to errors. please review the errors and try again'}
                message={'Error in upload'}
                buttonStyle={'bg-error hover:bg-error-hover'}
              />
            )
          }
        </div>
      )} 
    </div>
  )
}

export default BulkUserUpload;