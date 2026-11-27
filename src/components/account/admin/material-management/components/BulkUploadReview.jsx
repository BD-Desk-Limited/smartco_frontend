import React from 'react';
import { useBulkMaterialUpload } from '@/contexts/bulkMaterialUploadContext';
import { useRouter } from 'next/navigation';
import PageDescription from '@/components/account/PageDescription';
import Header from '@/components/account/admin/AdminHeader';
import SubHeader from '../../SubHeader';
import MaterialSidebar from './materialSidebar';
import Button from '@/components/account/Button';
import { createMaterial } from '@/services/materialServices';
import SuccessModal from '@/components/account/SuccessModal';
import ErrorInterface from '@/components/account/errorInterface';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const BulkUploadReview = ({ pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const { bulkMaterialData, setBulkMaterialData, errorData, setErrorData } =
    useBulkMaterialUpload();
  const Router = useRouter();

  const selectedSubMenu = {
    name: 'Create Material',
    link: '/',
  };

  React.useEffect(() => {
    if (!bulkMaterialData) {
      Router.push('/pages/account/admin/manage-materials/bulk-material-upload');
    }
  }, [bulkMaterialData, Router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const response = await createMaterial(bulkMaterialData);
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
    setBulkMaterialData(null);
    setErrorData(null);
    Router.push('/pages/account/admin/manage-materials');
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
          <MaterialSidebar
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
            {bulkMaterialData && (
              <div className="flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5">
                {!hasError && (
                  <div className="flex flex-col gap-1 w-full items-center justify-center">
                    <h1 className="w-full text-center font-semibold">
                      Review materials to create
                    </h1>
                    <p className="text-text-gray text-sm w-full text-center">
                      Material are uploaded successfully, kindly review your
                      upload before submitting
                    </p>
                  </div>
                )}
                <div className="w-full flex justify-center items-center flex-col gap-5">
                  <div className="font-semibold w-full">
                    Your Uploaded Materials
                  </div>
                  <ResponsiveTable
                    className="w-full"
                    align="left"
                    dense
                    maxHeightClass={
                      hasError ? 'md:max-h-[30vh]' : 'md:max-h-[60vh]'
                    }
                    rows={bulkMaterialData}
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
                        header: 'Material Name',
                        cell: (m) => m.name,
                        mobile: 'title',
                      },
                      { key: 'type', header: 'Material Type', cell: (m) => m.materialType },
                      { key: 'category', header: 'Material Category', cell: (m) => m.category },
                      { key: 'unit', header: 'Material Unit', cell: (m) => m.unitOfMeasurement },
                      {
                        key: 'description',
                        header: 'Material Description',
                        cell: (m) => m.description,
                        mobile: 'wide',
                      },
                    ]}
                  />

                  {error && <ErrorInterface error={error} />}

                  {hasError ? (
                    <Button
                      text={'Retry Upload'}
                      onClick={() =>
                        Router.push(
                          '/pages/account/admin/manage-materials/bulk-material-upload'
                        )
                      }
                      buttonStyle={'bg-brand-blue hover:bg-blue-shadow1'}
                    />
                  ) : (
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
            subText={'All materials have been successfully created'}
            onClose={handleRefresh}
            buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
          />
        </div>
      )}
    </div>
  );
};

export default BulkUploadReview;
