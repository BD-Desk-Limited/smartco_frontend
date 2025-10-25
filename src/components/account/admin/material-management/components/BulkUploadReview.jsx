import React from 'react';
import { useBulkMaterialUpload } from '@/contexts/bulkMaterialUploadContext';
import { useRouter } from 'next/navigation';
import PageDescription from '@/components/account/PageDescription';
import Header from '@/components/account/Header';
import SubHeader from '../../../SubHeader';
import MaterialSidebar from './materialSidebar';
import Button from '@/components/account/Button';
import { createMaterial } from '@/services/materialServices';
import SuccessModal from '@/components/account/SuccessModal';
import ErrorInterface from '@/components/account/errorInterface';


const BulkUploadReview = ({pageDescription}) => {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const { bulkMaterialData, setBulkMaterialData, errorData, setErrorData } = useBulkMaterialUpload();
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

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            setLoading(true);
            setError(null);
            const response = await createMaterial(bulkMaterialData);
            if(response.data){
                setSuccess(true);
            };
            if(response.error){
                setError(response.error || 'An error occurred, please try again');
            };
        }catch(error){
            console.error(error);
            setError(error.message || 'An error occurred, please try again');
        }finally{
            setLoading(false);
        };
    };

    const handleRefresh = () => {
        setBulkMaterialData(null);
        setErrorData(null);
        Router.push('/pages/account/admin/manage-materials');
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
                <MaterialSidebar 
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
                      bulkMaterialData && (
                          <div className='flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5'>
                              {!hasError &&
                                <div className='flex flex-col gap-1 w-full items-center justify-center'>
                                  <h1 className='w-full text-center font-semibold'>Review materials to create</h1>
                                  <p className='text-text-gray text-sm w-full text-center'>Material are uploaded successfully, kindly review your upload before submitting</p>
                                </div>
                              }
                              <div className='w-full flex justify-center items-center flex-col gap-5'>
                                  <div className='font-semibold w-full'>Your Uploaded Materials</div>
                                  <table className={`w-full flex flex-col gap-1 ${hasError? 'max-h-[30vh]':'max-h-[60vh]'} overflow-y-auto scrollbar-thin`}>
                                      <thead className='w-full'>
                                          <tr className='w-full flex flex-row justify-between bg-gray-shadow9 font-thin text-text-gray p-1 text-sm'>
                                              <th className='text-left w-2'>S/No</th>
                                              <th className='text-left w-1/6'>Material Name</th>
                                              <th className='text-left w-1/8'>Material Type</th>
                                              <th className='text-left w-1/6'>Material Category</th>
                                              <th className='text-left w-1/8'>Material Unit</th>
                                              <th className='text-left w-1/4'>Material Description</th>
                                          </tr>
                                      </thead>
                                      <tbody className='w-full max-h-50 overflow-y-auto scrollbar-thin'>
                                          {
                                              bulkMaterialData.map((material, index) => (
                                                  <tr key={index} className='w-full flex flex-row justify-between border border-gray-shadow9 p-1 text-sm'>
                                                      <td className='text-left font-semibold w-2'>{index + 1}</td>
                                                      <td className='text-left w-1/6'>{material.name}</td>
                                                      <td className='text-left w-1/8'>{material.materialType}</td>
                                                      <td className='text-left w-1/6'>{material.category}</td>
                                                      <td className='text-left w-1/8'>{material.unitOfMeasurement}</td>
                                                      <td className='text-left w-1/4 overflow-x-auto '>{material.description}</td>
                                                  </tr>
                                              ))
                                          }
                                      </tbody>
                                  </table>

                                  {error && <ErrorInterface error={error} />}

                                  {hasError?
                                    <Button 
                                        text={'Retry Upload'} 
                                        onClick={() => Router.push('/pages/account/admin/manage-materials/bulk-material-upload')} 
                                        buttonStyle={'bg-brand-blue hover:bg-blue-shadow1'}
                                    />
                                    :
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
                      )
                  }
                </div>
                <PageDescription pageDescription={pageDescription} />
              </div>
            </div>
            {success&&
                <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
                    <SuccessModal 
                        title={'Bulk Upload Success'}
                        message={'Success!!!'}
                        subText={'All materials have been successfully created'}
                        onClose={handleRefresh}
                        buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
                    />
                </div>
            }
        </div>
        
    );
}

export default BulkUploadReview;