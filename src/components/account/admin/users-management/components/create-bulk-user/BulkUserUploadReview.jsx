import React from 'react';
import { useRouter } from 'next/navigation';
import { useBulkUserUpload } from '@/contexts/bulkUserUploadContext';
import { createUserService } from '@/services/usersServices';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import UsersManagementSidebar from '../UsersManagementSidebar';
import SuccessModal from '@/components/account/SuccessModal';
import PageDescription from '@/components/account/PageDescription';
import Button from '@/components/account/Button';
import ReviewCreatedUsers from './ReviewCreatedUsers';
import ErrorInterface from '@/components/account/errorInterface';

const BulkUserUploadReview = ({pageDescription}) => {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const { bulkUserData, setBulkUserData, errorData, setErrorData } = useBulkUserUpload();
    const [existingUsers, setExistingUsers] = React.useState([]);
    const [newUsers, setNewUsers] = React.useState([]);
    const [usersWithErrors, setUsersWithErrors] = React.useState([]);
    const Router = useRouter();

    const selectedSubMenu = {
      staffId: 'Create New User',
      link: '/create-user',
    };

    const goToUploadPage = () => {
        Router.push('/pages/account/admin/users-management/create-bulk-user');
    };

    React.useEffect(() => {
        if (!bulkUserData) {
            goToUploadPage();
        }
    }, [bulkUserData, Router]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            setLoading(true);
            setError(null);
            console.log('Submitting bulk user data:', bulkUserData);
            const response = await createUserService(bulkUserData);
            if(response.error){
                setError(response.error || 'An error occurred, please try again');
            };
            if(response.data){
                setSuccess(true);
                setExistingUsers(response?.data?.data?.existingUsers || []);
                setNewUsers(response?.data?.data?.newUsers || []);
                setUsersWithErrors(response?.data?.data?.usersNotCreated || []);
            };
        }catch(error){
            console.error(error);
            setError(error.message || 'An error occurred, please try again');
        }finally{
            setLoading(false);
        };
    };

    const handleRefresh = () => {
        setBulkUserData(null);
        setErrorData(null);
        Router.push('/pages/account/admin/users-management/create-user');
    };
    
    // Check if there are any errors in the errorData
    const hasError = errorData && errorData.length > 0 
        && !errorData.every(
            (error) => Object.values(error).every((value) => value.length === 0)
        );
    
    // Filter out datasets with no errors
    const filteredErrorData = errorData && errorData.filter(dataset => 
        Object.values(dataset).some(value => value.length > 0)
    );


  return (
    <div>
        <div className="w-full sticky top-0 z-50">
          <Header />
        </div>
        <div className="w-full">
            <SubHeader title={'Bulk Upload Review'}/>
        </div>
        <div className="flex flex-row gap-0 w-full h-full">
          <div className="min-w-fit">
            <UsersManagementSidebar
              selectedSubMenu={selectedSubMenu}
              isOpen={openSidebar}
              setIsOpen={setOpenSidebar}
            />
          </div>
          <div className="flex flex-col w-full h-full mx-5">
            <div>
              {
                errorData&& errorData.length > 0 && hasError && (
                    <div className='flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5'>
                        <div className='flex flex-col gap-1 w-full items-center justify-center'>
                          <h1 className='w-full text-center font-semibold'>Review Errors</h1>
                          <p className='text-text-gray text-sm w-full text-center'>The following error were encountered in your uploaded file. Please fix the errors and retry the upload</p>
                        </div>
                        <table className='w-full flex flex-col gap-1'>
                            <thead className='w-full'>
                                <tr className='w-full flex flex-row justify-between bg-gray-shadow9 font-thin text-text-gray p-1 text-sm'>
                                    <th>S/No</th>
                                    <th>Error Description</th>
                                    <th>Row to check</th>
                                </tr>
                            </thead>
                            <tbody className='w-full max-h-[50vh] overflow-y-auto scrollbar-thin'>
                            {filteredErrorData.map((datasets, Index) => (
                                <tr key={Index} className='w-full flex flex-row justify-between border border-gray-shadow9 p-1 text-sm'>
                                    <td className='font-semibold w-5'>{Index + 1}</td>
                                    <td className=''>
                                        {
                                            Object.values(datasets).map((errorDetail, index) => (
                                                <p key={index} className='text-error flex flex-col gap-0.5'>
                                                    {errorDetail.map((detail, indx) => (
                                                        <span key={indx}>{detail.error}</span>    
                                                    ))}
                                                </p>
                                            ))
                                        }
                                    </td>
                                    <td className='max-w-60 overflow-x-auto'>
                                        {
                                            Object.values(datasets).map((errorDetail, index) => (
                                                <p key={index} className='text-error flex flex-col gap-0.5'>
                                                    {errorDetail.map((detail, indx) => (
                                                        <span key={indx}>{detail.row}</span>    
                                                    ))}
                                                </p>
                                            ))
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )
              }
            </div>

            <div className=''>
                  {
                      bulkUserData && (
                          <div className='flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5'>
                              {!hasError &&
                                <div className='flex flex-col gap-1 w-full items-center justify-center'>
                                  <h1 className='w-full text-center font-semibold'>Review users to create</h1>
                                  <p className='text-text-gray text-sm w-full text-center'>Users are uploaded successfully, kindly review your upload before submitting</p>
                                </div>
                              }
                              <div className='w-full flex justify-center items-center flex-col gap-5'>
                                  <div className='font-semibold w-full'>Your Uploaded users</div>
                                  <table className={`w-full flex flex-col gap-1 ${hasError? 'max-h-[30vh]':'max-h-[60vh]'} overflow-y-auto scrollbar-thin`}>
                                      <thead className='w-full'>
                                          <tr className='w-full flex flex-row justify-between bg-gray-shadow9 font-thin text-text-gray p-1 text-sm'>
                                              <th className='w-8 text-left'>S/No</th>
                                              <th className='w-12 text-left'>Staff ID</th>
                                              <th className='w-1/6 text-left'>Full Name</th>
                                              <th className='w-8 text-left'>Role</th>
                                              <th className='w-1/4 text-left'>{`Branch(es)`}</th>
                                              <th  className='w-1/6 text-left'>Phone Number</th>
                                          </tr>
                                      </thead>
                                      <tbody className='w-full max-h-50 overflow-y-auto scrollbar-thin'>
                                          {
                                            bulkUserData.map((user, index) => (
                                                <tr key={index} className='w-full flex flex-row justify-between border border-gray-shadow9 p-1 text-sm'>
                                                    <td className='font-semibold w-8'>{index + 1}</td>
                                                    <td className='w-12 text-left'>{user.staffId}</td>
                                                    <td className='w-1/6 text-left'>{user.fullName}</td>
                                                    <td className='w-8 text-left'>{user.role.charAt(0).toUpperCase() + user?.role?.slice(1)}</td>
                                                    {/* separate branches with , if we have more than one branch. else render the first branch */}
                                                    <td className='w-1/4 text-left'>
                                                        {user.branch?.length > 1 ?
                                                            user.branch?.join(', ')
                                                            : user.branch[0]
                                                        }
                                                    </td>
                                                    <td className='w-1/6 text-left'>{user.phoneNumber || ' '}</td>
                                                </tr>
                                            ))
                                          }
                                      </tbody>
                                  </table>

                                  {error && <ErrorInterface error={error} />}

                                <div className='w-full flex flex-row justify-center gap-10 mt-1'>
                                <Button 
                                    text={'Retry Upload'} 
                                    onClick={goToUploadPage}
                                    buttonStyle={'bg-brand-blue hover:bg-blue-shadow1'}
                                />
                                {!hasError &&
                                    <Button 
                                      text={'Submit and save'} 
                                      onClick={handleSubmit} 
                                      loading={loading} 
                                      loadingText={'submitting'}
                                      buttonStyle={'bg-brand-green hover:bg-green-shadow1'}
                                    />
                                  }
                                </div>
                              </div>
                          </div>
                      )
                  }
                </div>
                <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
        {success&& (
            usersWithErrors.length < 1 && existingUsers.length < 1?(
                <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
                    <SuccessModal
                        title={'Bulk Upload Success'}
                        message={'Success!!!'}
                        subText={`All ${bulkUserData?.length} users have been created successfully`}
                        onClose={handleRefresh}
                        buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
                    />
                </div>
            ) : (
                <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
                    <ReviewCreatedUsers
                        existingUsers={existingUsers}
                        newUsers={newUsers}
                        usersWithErrors={usersWithErrors}
                        onClose={handleRefresh}
                    />
                </div>
            ))
        }
    </div> 
  )
}

export default BulkUserUploadReview;