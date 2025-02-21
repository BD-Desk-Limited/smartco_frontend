import React from 'react';
import { useBulkMaterialUpload } from '@/contexts/bulkMaterialUploadContext';
import { useRouter } from 'next/navigation';
import PageDescription from '@/components/account/PageDescription';
import Header from '@/components/account/Header';
import SubHeader from './SubHeader';
import MaterialSidebar from './materialSidebar';
import Button from '@/components/account/Button';


const BulkUploadReview = ({pageDescription}) => {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const { bulkMaterialData } = useBulkMaterialUpload();
    const Router = useRouter();

    const selectedSubMenu = {
        name: 'Create Material',
        link: '/',
    };

    React.useEffect(() => {
        if (!bulkMaterialData) {
            Router.push('/pages/account/admin/manage-materials');
        }
    }, [bulkMaterialData, Router]);

    const handleSubmit = () => {
        console.log('submitting', bulkMaterialData);
    };

    console.log('bulkMaterialData', bulkMaterialData);

    return (
        <div>
            <div className="w-full sticky top-0 z-50">
              <Header />
            </div>
            <div className="w-full">
                <SubHeader title={'Material Management'}/>
            </div>
            <div className="flex flex-row gap-0 w-full h-full">
              <div className="min-w-fit">
                <MaterialSidebar 
                  selectedSubMenu={selectedSubMenu}
                  isOpen={openSidebar}
                  setIsOpen={setOpenSidebar}
                />
              </div>
              <div className="flex flex-col w-full h-full">
              <div className=''>
                {
                    bulkMaterialData && (
                        <div className='flex justify-center items-center flex-col p-4 gap-4 w-full bg-text-white rounded-lg my-5'>
                            <div className='flex flex-col gap-1 w-full items-center justify-center'>
                                <h1 className='w-full text-center font-semibold'>Review materials to create</h1>
                                <p className='text-text-gray text-sm w-full text-center'>Material are uploaded successfully, kindly review your upload before submitting</p>
                            </div>
                            <div className='w-full flex justify-center items-center flex-col gap-5'>
                                <div className='font-semibold w-full'>Your Uploaded Materials</div>
                                <table className='w-full flex flex-col gap-1'>
                                    <thead className='w-full'>
                                        <tr className='w-full flex flex-row justify-between bg-gray-shadow9 font-thin text-text-gray p-1 text-sm'>
                                            <th>Material Name</th>
                                            <th>Material Type</th>
                                            <th>Material Category</th>
                                            <th>Material Unit</th>
                                            <th>Material Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className='w-full max-h-50 overflow-y-auto scrollbar-thin'>
                                        {
                                            bulkMaterialData.map((material, index) => (
                                                <tr key={index} className='w-full flex flex-row justify-between border border-gray-shadow9 p-1 text-sm'>
                                                    <td>{material.name}</td>
                                                    <td>{material.materialType}</td>
                                                    <td>{material.category}</td>
                                                    <td>{material.unitOfMeasurement}</td>
                                                    <td>{material.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                <Button text={'Submit and save'} onClick={handleSubmit} loading={loading} loadingText={'submitting'}/>
                            </div>
                        </div>
                    )
                }
              </div>
              <PageDescription pageDescription={pageDescription} />
              </div>
            </div>
        </div>
        
    );
}

export default BulkUploadReview;