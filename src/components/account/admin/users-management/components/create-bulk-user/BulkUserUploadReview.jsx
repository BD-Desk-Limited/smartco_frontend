import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBulkUserUpload } from '@/contexts/bulkUserUploadContext';
import { createUserService } from '@/services/usersServices';
import Header from '@/components/account/admin/AdminHeader';
import SubHeader from '@/components/account/admin/SubHeader';
import UsersManagementSidebar from '../UsersManagementSidebar';
import SuccessModal from '@/components/account/SuccessModal';
import PageDescription from '@/components/account/PageDescription';
import Button from '@/components/account/Button';
import ReviewCreatedUsers from './ReviewCreatedUsers';
import ErrorInterface from '@/components/account/errorInterface';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const BulkUserUploadReview = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const { bulkUserData, setBulkUserData, errorData, setErrorData } =
    useBulkUserUpload();
  const [existingUsers, setExistingUsers] = React.useState([]);
  const [newUsers, setNewUsers] = React.useState([]);
  const [usersWithErrors, setUsersWithErrors] = React.useState([]);
  const Router = useRouter();

  const selectedSubMenu = {
    staffId: 'Create New User',
    link: '/create-user',
  };

  const goToUploadPage = useCallback(() => {
    Router.push('/pages/account/admin/users-management/create-bulk-user');
  }, [Router]);

  React.useEffect(() => {
    if (!bulkUserData) {
      goToUploadPage();
    }
  }, [bulkUserData, Router, goToUploadPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      console.log('Submitting bulk user data:', bulkUserData);
      const response = await createUserService(bulkUserData);
      if (response.error) {
        setError(response.error || 'An error occurred, please try again');
      }
      if (response.data) {
        setSuccess(true);
        setExistingUsers(response?.data?.data?.existingUsers || []);
        setNewUsers(response?.data?.data?.newUsers || []);
        setUsersWithErrors(response?.data?.data?.usersNotCreated || []);
      }
    } catch (error) {
      console.error(error);
      setError(error.message || 'An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setBulkUserData(null);
    setErrorData(null);
    Router.push('/pages/account/admin/users-management/create-user');
  };

  // Check if there are any errors in the errorData
  const hasError =
    errorData &&
    errorData.length > 0 &&
    !errorData.every((error) =>
      Object.values(error).every((value) => value.length === 0)
    );

  // Filter out datasets with no errors
  const filteredErrorData =
    errorData &&
    errorData.filter((dataset) =>
      Object.values(dataset).some((value) => value.length > 0)
    );

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'Bulk Upload Review'} />
      </div>
      <div className="flex flex-col md:flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <UsersManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full h-full px-2 md:px-5 pb-6">
          <div>
            {errorData && errorData.length > 0 && hasError && (
              <div className="flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5">
                <div className="flex flex-col gap-1 w-full items-center justify-center">
                  <h1 className="w-full text-center font-semibold">
                    Review Errors
                  </h1>
                  <p className="text-text-gray text-sm w-full text-center">
                    The following error were encountered in your uploaded file.
                    Please fix the errors and retry the upload
                  </p>
                </div>
                <ResponsiveTable
                  className="w-full"
                  align="left"
                  dense
                  maxHeightClass="md:max-h-[50vh]"
                  rows={filteredErrorData}
                  getRowKey={(_, i) => i}
                  columns={[
                    {
                      key: 'sn',
                      header: 'S/No',
                      cell: (_, i) => i + 1,
                      mobile: 'badge',
                      cellClass: () => 'font-semibold',
                    },
                    {
                      key: 'error',
                      header: 'Error Description',
                      mobile: 'title',
                      cell: (datasets) =>
                        Object.values(datasets).map((errorDetail, index) => (
                          <span
                            key={index}
                            className="text-error flex flex-col gap-0.5 font-normal"
                          >
                            {errorDetail.map((detail, indx) => (
                              <span key={indx}>{detail.error}</span>
                            ))}
                          </span>
                        )),
                    },
                    {
                      key: 'row',
                      header: 'Row to check',
                      mobile: 'wide',
                      cell: (datasets) =>
                        Object.values(datasets).map((errorDetail, index) => (
                          <span
                            key={index}
                            className="text-error flex flex-col gap-0.5"
                          >
                            {errorDetail.map((detail, indx) => (
                              <span key={indx}>{detail.row}</span>
                            ))}
                          </span>
                        )),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <div className="">
            {bulkUserData && (
              <div className="flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5">
                {!hasError && (
                  <div className="flex flex-col gap-1 w-full items-center justify-center">
                    <h1 className="w-full text-center font-semibold">
                      Review users to create
                    </h1>
                    <p className="text-text-gray text-sm w-full text-center">
                      Users are uploaded successfully, kindly review your upload
                      before submitting
                    </p>
                  </div>
                )}
                <div className="w-full flex justify-center items-center flex-col gap-5">
                  <div className="font-semibold w-full">
                    Your Uploaded users
                  </div>
                  <ResponsiveTable
                    className="w-full"
                    align="left"
                    dense
                    maxHeightClass={
                      hasError ? 'md:max-h-[30vh]' : 'md:max-h-[60vh]'
                    }
                    rows={bulkUserData}
                    getRowKey={(_, i) => i}
                    columns={[
                      {
                        key: 'sn',
                        header: 'S/No',
                        cell: (_, i) => i + 1,
                        mobile: 'badge',
                        cellClass: () => 'font-semibold',
                      },
                      { key: 'staffId', header: 'Staff ID', cell: (u) => u.staffId },
                      {
                        key: 'name',
                        header: 'Full Name',
                        mobile: 'title',
                        cell: (u) => u.fullName,
                      },
                      {
                        key: 'role',
                        header: 'Role',
                        cell: (u) => u.role.charAt(0).toUpperCase() + u?.role?.slice(1),
                      },
                      {
                        key: 'branches',
                        header: 'Branch(es)',
                        mobile: 'wide',
                        cell: (u) =>
                          u.branch?.length > 1 ? u.branch?.join(', ') : u.branch[0],
                      },
                      {
                        key: 'phone',
                        header: 'Phone Number',
                        cell: (u) => u.phoneNumber || ' ',
                      },
                    ]}
                  />

                  {error && <ErrorInterface error={error} />}

                  <div className="w-full flex flex-row justify-center gap-10 mt-1">
                    <Button
                      text={'Retry Upload'}
                      onClick={goToUploadPage}
                      buttonStyle={'bg-brand-blue hover:bg-blue-shadow1'}
                    />
                    {!hasError && (
                      <Button
                        text={'Submit and save'}
                        onClick={handleSubmit}
                        loading={loading}
                        loadingText={'submitting'}
                        buttonStyle={'bg-brand-green hover:bg-green-shadow1'}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
      </div>
      {success &&
        (usersWithErrors.length < 1 && existingUsers.length < 1 ? (
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
        ))}
    </div>
  );
};

export default BulkUserUploadReview;
