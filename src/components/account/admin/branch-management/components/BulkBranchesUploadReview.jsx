import React from 'react';
import { useBulkbranchUpload } from '@/contexts/bulkBranchUploadContext';
import { useRouter } from 'next/navigation';
import PageDescription from '@/components/account/PageDescription';
import Header from '@/components/account/admin/AdminHeader';
import SubHeader from '../../SubHeader';
import BranchSidebar from './BranchSideBar';
import Button from '@/components/account/Button';
import { createBranchService } from '@/services/branchServices';
import SuccessModal from '@/components/account/SuccessModal';
import ErrorInterface from '@/components/account/errorInterface';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const BulkBranchesUploadReview = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const { bulkbranchData, setBulkbranchData, errorData, setErrorData } =
    useBulkbranchUpload();
  const Router = useRouter();
  const selectedSubMenu = {
    name: 'View all branches',
    link: '/create-branch',
  };

  React.useEffect(() => {
    if (!bulkbranchData) {
      Router.push('/pages/account/admin/branch-management/create-branch/bulk');
    }
  }, [bulkbranchData, Router]);

  const formatBusinessHours = (timeInput) => {
    //convert timeInput to string
    const timeString = String(timeInput);

    // Format the time for business hours display, ensure whatever user inputs is properly formatted to HH:MMAM/PM
    if (!timeString || timeString.length === 0) {
      return { isValid: false, display: 'N/A' };
    }
    // Remove any whitespace and convert to uppercase
    const cleanTime = timeString?.trim()?.toUpperCase();

    // Regular expression for HH:MMAM/PM format
    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])(AM|PM)$/;
    if (!timeRegex.test(cleanTime)) {
      return {
        isValid: false,
        display: 'Invalid Time',
      };
    }
    return {
      isValid: true,
      display: cleanTime,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await createBranchService(bulkbranchData);
      if (response.data) {
        setSuccess(true);
      }
      if (response.error) {
        setError(response.error || 'An error occurred, please try again');
      }
    } catch (error) {
      console.error(error);
      setError(error.message || 'An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setBulkbranchData(null);
    setErrorData(null);
    Router.push('/pages/account/admin/branch-management/create-branch/bulk');
  };

  const hasError =
    errorData &&
    errorData.length > 0 &&
    !errorData.every((error) =>
      Object.values(error).every((value) => value.length === 0)
    );
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
          <BranchSidebar
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
            {bulkbranchData && (
              <div className="flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5">
                {!hasError && (
                  <div className="flex flex-col gap-1 w-full items-center justify-center">
                    <h1 className="w-full text-center font-semibold">
                      Review new branches to create
                    </h1>
                    <p className="text-text-gray text-sm w-full text-center">
                      Branches information uploaded successfully, kindly review
                      your upload before submitting
                    </p>
                  </div>
                )}
                <div className="w-full flex justify-center items-center flex-col gap-5">
                  <div className="font-semibold w-full">
                    Your Uploaded Branches
                  </div>
                  <ResponsiveTable
                    className="w-full"
                    align="left"
                    dense
                    maxHeightClass={
                      hasError ? 'md:max-h-[30vh]' : 'md:max-h-[60vh]'
                    }
                    rows={bulkbranchData}
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
                        key: 'name',
                        header: 'Branch Name',
                        cell: (b) => b.name,
                        mobile: 'title',
                      },
                      { key: 'branchId', header: 'Branch ID', cell: (b) => b.branchId },
                      { key: 'email', header: 'Email', cell: (b) => b.email, mobile: 'subtitle' },
                      { key: 'phone', header: 'Phone Number', cell: (b) => b.phoneNumber },
                      { key: 'band', header: 'Band', cell: (b) => b.band },
                      { key: 'taxBand', header: 'Tax Band', cell: (b) => b.taxBand },
                      { key: 'taxRate', header: 'Tax Rate(%)', cell: (b) => b.taxRate },
                      { key: 'address', header: 'Address', cell: (b) => b.address, mobile: 'wide' },
                      {
                        key: 'open',
                        header: 'Opening Hour',
                        cell: (b) => formatBusinessHours(b?.openingHour).display,
                        cellClass: (b) =>
                          formatBusinessHours(b?.openingHour).display === 'Invalid Time'
                            ? 'text-red-500'
                            : '',
                      },
                      {
                        key: 'close',
                        header: 'Closing Hour',
                        cell: (b) => formatBusinessHours(b?.closingHour).display,
                        cellClass: (b) =>
                          formatBusinessHours(b?.closingHour).display === 'Invalid Time'
                            ? 'text-red-500'
                            : '',
                      },
                    ]}
                  />

                  {error && <ErrorInterface error={error} />}
                  <div className="flex flex-row flex-wrap gap-4 justify-center">
                    <Button
                      text={'Retry Upload'}
                      onClick={() =>
                        Router.push(
                          '/pages/account/admin/branch-management/create-branch/bulk'
                        )
                      }
                      buttonStyle={'bg-brand-blue hover:bg-blue-shadow1'}
                    />

                    {!hasError && (
                      <Button
                        text={'Submit and save'}
                        onClick={handleSubmit}
                        loading={loading}
                        loadingText={'submitting...'}
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
      {success && (
        <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
          <SuccessModal
            title={'Bulk Upload Success'}
            message={'Success!!!'}
            subText={'All new branches have been successfully created'}
            onClose={handleRefresh}
            buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
          />
        </div>
      )}
    </div>
  );
};

export default BulkBranchesUploadReview;
