import React from 'react';
import { useBulkbranchUpload } from '@/contexts/bulkBranchUploadContext';
import { useRouter } from 'next/navigation';
import PageDescription from '@/components/account/PageDescription';
import Header from '@/components/account/Header';
import SubHeader from '../../../SubHeader';
import BranchSidebar from './BranchSideBar';
import Button from '@/components/account/Button';
import { createBranchService } from '@/services/branchServices';
import SuccessModal from '@/components/account/SuccessModal';
import ErrorInterface from '@/components/account/errorInterface';

const BulkBranchesUploadReview = ({pageDescription}) => {

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const { bulkbranchData, setBulkbranchData, errorData, setErrorData } = useBulkbranchUpload();
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        setLoading(true);
        setError(null);
        const response = await createBranchService(bulkbranchData);
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
    setBulkbranchData(null);
    setErrorData(null);
    Router.push('/pages/account/admin/branch-management/create-branch/bulk');
  };

  const hasError = errorData && errorData.length > 0 && !errorData.every((error) => Object.values(error).every((value) => value.length === 0));
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
                <BranchSidebar 
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
                      bulkbranchData && (
                          <div className='flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5'>
                              {!hasError &&
                                <div className='flex flex-col gap-1 w-full items-center justify-center'>
                                  <h1 className='w-full text-center font-semibold'>Review new branches to create</h1>
                                  <p className='text-text-gray text-sm w-full text-center'>Branches information uploaded successfully, kindly review your upload before submitting</p>
                                </div>
                              }
                              <div className='w-full flex justify-center items-center flex-col gap-5'>
                                  <div className='font-semibold w-full'>Your Uploaded Branches</div>
                                  <table className={`w-full flex flex-col gap-1 ${hasError? 'max-h-[30vh]':'max-h-[60vh]'} overflow-y-auto scrollbar-thin`}>
                                      <thead className='w-full'>
                                          <tr className='w-full flex flex-row justify-between bg-gray-shadow9 font-thin text-text-gray p-1 text-sm'>
                                              <th className='font-semibold w-7'>S/No</th>
                                              <th className='mx-1 w-[10%] text-left'>Branch Name</th>
                                              <th className='mx-1 w-[10%] text-left'>Branch I D</th>
                                              <th className='mx-1 w-[15%] text-left'>Email</th>
                                              <th className='mx-1 w-[10%] text-left'>Phone Number</th>
                                              <th className='mx-1 w-[10%] text-left'>Band</th>
                                              <th className='mx-1 w-[10%] text-left'>Tax Band</th>
                                              <th className='mx-1 w-[5%] text-left'>Tax Rate</th>
                                              <th className='mx-1 w-[15%] text-left'>Address</th>
                                              <th className='mx-1 w-[5%] text-left'>Opening Hour -</th>
                                              <th className='mx-1 w-[5%] text-left'>Closing Hour</th>
                                          </tr>
                                      </thead>
                                      <tbody className='w-full max-h-50 overflow-y-auto scrollbar-thin'>
                                          {
                                              bulkbranchData.map((branch, index) => (
                                                <tr key={index} className='w-full flex flex-row justify-between border border-gray-shadow9 p-1 text-sm'>
                                                    <td className='font-semibold w-7'>{index + 1}</td>
                                                    <td className='mx-1 w-[10%] text-left'>{branch.name}</td>
                                                    <td className='mx-1 w-[10%] text-left'>{branch.branchId}</td>
                                                    <td className='mx-1 w-[15%] text-left'>{branch.email}</td>
                                                    <td className='mx-1 w-[10%] text-left'>{branch.phoneNumber}</td>
                                                    <td className='mx-1 w-[10%] text-left'>{branch.band}</td>
                                                    <td className='mx-1 w-[10%] text-left'>{branch.taxBand}</td>
                                                    <td className='mx-1 w-[5%] text-left'>{branch.taxRate}</td>
                                                    <td className='mx-1 w-[15%] text-left'>{branch.address}</td>
                                                    <td className='mx-1 w-[5%] text-left'>{branch.openingHour || 'N/A'}</td>
                                                    <td className='mx-1 w-[5%] text-left'>{branch.closingHour || 'N/A'}</td>
                                                </tr>
                                              ))
                                          }
                                      </tbody>
                                  </table>

                                  {error && <ErrorInterface error={error}/>}
                                  <div className='flex flex-row gap-4 justify-center'>
                                    <Button 
                                      text={'Retry Upload'} 
                                      onClick={() => Router.push('/pages/account/admin/branch-management/create-branch/bulk')} 
                                      buttonStyle={'bg-brand-blue hover:bg-blue-shadow1'}
                                    />
                                    
                                    {!hasError&&
                                      <Button 
                                        text={'Submit and save'} 
                                        onClick={handleSubmit} 
                                        loading={loading} 
                                        loadingText={'submitting...'}
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
            {success&&
              <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center">
                <SuccessModal 
                    title={'Bulk Upload Success'}
                    message={'Success!!!'}
                    subText={'All new branches have been successfully created'}
                    onClose={handleRefresh}
                    buttonStyle={'bg-brand-blue hover:bg-blue-shadow5'}
                />
              </div>
            }
        </div>
  )
}

export default BulkBranchesUploadReview;