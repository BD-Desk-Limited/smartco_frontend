import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import BranchSidebar from './BranchSideBar';
import PageDescription from '@/components/account/PageDescription';
import Image from 'next/image';
import DeactivationModal from '@/components/account/DeactivationModal';
import SuccessModal from '@/components/account/SuccessModal';
import { toggleBranchStatus } from '@/services/branchServices';
import UsersInBranch from './UsersInBranch';
import Button from '@/components/account/Button';
import { useRouter } from 'next/navigation';

const ViewBranchDetails = ({pageDescription, branchData, setBranchData}) => {

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openStatusModal, setOpenStatusModal] = React.useState(false);
    const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
    const [deactivationErrors, setDeactivationErrors] = React.useState([]);
    const [seeTaxBandInfo, setSeeTaxBandInfo] = React.useState(false);
    const router = useRouter();
    
    const selectedSubMenu = {
      name: 'View all branches',
      link: '/',
    };

    const handleChangeBranchStatus = async() => {
    
        try{
            setLoading(true);

            let response;
            if (branchData?.status === 'active') {
                //deactivate branches
                response = await toggleBranchStatus([branchData?._id], 'inactive');
            }else if (branchData?.status === 'inactive') {
                //activate branches
                response = await toggleBranchStatus([branchData._id], 'active');
            }
            if (response.error) {
                console.error(response.error, 'error changing branch status');
                setDeactivationErrors([response.error]);
            }else if (response.data) {
                console.log('response:', response.data[0].updatedBy);
                setBranchData((prevState) => ({
                    ...prevState,
                    status: response.data[0].status,
                    updatedBy: response.data[0].updatedBy?.fullName,
                }));
                setOpenSuccessModal(true);
                setOpenStatusModal(false);
            }
        }catch(err){
            console.error('Error changing branch status:', err);
            setDeactivationErrors(['Error changing branch status, please try again']);
            setDeactivationMessages([]);
        }finally{
            setLoading(false);
        }
    };


  return (
    <div className='w-full h-full max-h-screen overflow-hidden'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'View Branch details'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <BranchSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full max-h-[85vh] overflow-y-auto scrollbar-thin">

            <div className="bg-white p-5 mx-5 my-2 rounded-md max-h-[90vh] overflow-y-auto scrollbar-thin flex flex-col gap-5 px-5 py-5 relative">
                <div className="absolute top-2 right-5 flex items-center justify-center gap-2">
                  <span className={`w-5 h-5 rounded-full ${branchData.status === 'active' ? 'bg-brand-green' : 'bg-error'}`}></span>
                  {branchData.status&&<span className='font-semibold'>{branchData?.status?.charAt(0).toUpperCase() + branchData?.status?.slice(1)}</span>}
                  <Image
                      src={branchData?.status === 'active'? "/assets/switch_active.png" : "/assets/switch_inactive.png"}
                      alt="deactivate"
                      width={27}
                      height={27}
                      onClick={()=>setOpenStatusModal(true)}
                      className='cursor-pointer'
                      title={branchData?.status === 'active' ? 'Deactivate branch' : 'Activate branch'}
                  />
                </div>

                <div 
                    className='absolute top-2 left-2 flex items-center justify-center gap-2 px-2 font-semibold hover:text-green-shadow4 text-brand-green cursor-pointer shadow-md' 
                    onClick={() => router.push('/pages/account/admin/branch-management')}>
                    <Image src={'/assets/back_green.png'} height={10} width={10} alt='branch'/>
                    <span>Back</span>
                </div>

                <div className='flex flex-col gap-2 w-full my-8'>
                    <h2 className="text-lg font-bold text-brand-blue">{branchData?.name}</h2>
                    <p className="text-sm text-text-gray">Branch ID: {branchData?.branchId}</p>
                    <div className="flex flex-row justify-between gap-2 border-y border-gray-border text-left">
                        <div className='flex flex-row gap-2 py-2'>
                            <p className="text-sm text-text-gray flex flex-row items-center">
                                <Image src={'/assets/email.png'} height={20} width={20} alt='email'/>
                                {branchData?.email}
                            </p>
                            <p className="text-sm text-text-gray flex flex-row items-center">
                                <Image src={'/assets/phone.png'} height={20} width={20} alt='phone'/>
                                {branchData?.phoneNumber}
                            </p>
                            <p className="text-sm text-text-gray flex flex-row items-center">
                                <Image src={'/assets/location.png'} height={20} width={20} alt='address'/>
                                {branchData?.address}
                            </p>
                        </div>
                        <div className='flex flex-row gap-2 py-2'>
                            <p className="text-sm text-text-gray flex flex-col items-center border-r-2 border-gray-border pr-2">
                                <span className='flex flex-row gap-2 items-center'>
                                    <Image src={'/assets/clock_green.png'} height={20} width={20} alt='opening hours'/>
                                    Opening Hour:
                                </span>
                                {branchData?.openingHour || 'Not available'}
                            </p>
                            
                            <p className="text-sm text-text-gray flex flex-col items-center border-r-2 border-gray-border pr-2">
                                <span className='flex flex-row gap-2 items-center'>
                                    <Image src={'/assets/clock_red.png'} height={20} width={20} alt='closing hours'/>
                                    closing Hour:
                                </span>
                                {branchData?.closingHour || 'Not available'}
                            </p>
                        </div>
                        
                    </div>
                        <div className="flex flex-row gap-2 py-2 justify-between">
                            <div className="flex flex-col gap-2 py-2">
                                <p className="text-sm text-text-gray">Branch Band: <strong>{branchData?.band}</strong></p>
                                <p className="text-sm text-text-gray">Created on: {branchData?.createdAt ? new Date(branchData.createdAt).toLocaleDateString() : 'N/A'}</p>
                                <p className="text-sm text-text-gray">Created by: {branchData?.createdBy?.fullName}</p>
                                <p className="text-sm text-text-gray">Last updated: {branchData?.updatedAt ? new Date(branchData.updatedAt).toLocaleDateString() : 'N/A'}</p>
                                <p className="text-sm text-text-gray">Last updated by: {branchData?.updatedBy?.fullName}</p>
                                <p className="text-sm text-text-gray flex flex-row gap-2 items-center">
                                    <span>Tax Band: <strong>{branchData?.taxBand?.name}</strong></span>
                                    <Image 
                                        src={'/assets/info.png'} height={20} 
                                        width={20} 
                                        alt='info' 
                                        className='cursor-pointer' 
                                        onClick={() => setSeeTaxBandInfo(true)}
                                        title={`${branchData?.taxBand?.rate}%. Click for more info`}
                                    />
                                    {seeTaxBandInfo &&
                                        <span className='absolute bg-white border border-brand-blue rounded-md p-1 w-[50%] z-50' onMouseLeave={() => setSeeTaxBandInfo(false)}>
                                            <span className='text-sm text-text-gray'>Tax Band: {branchData?.taxBand?.description}</span>
                                        </span>
                                    }
                                </p>
                            </div>
                            <div>
                                <Button 
                                    text={'Update branch information'}
                                    buttonStyle={'bg-brand-green hover:bg-green-shadow1 text-white'}
                                    onClick={() => router.push(`/pages/account/admin/branch-management/edit-branch?id=${branchData._id}`)}
                                />
                            </div>
                        </div>
                </div>

                {/*users in the branch */}
                <div className='shadow-md w-full'>
                    <UsersInBranch branchId={branchData._id}/>
                </div>

            </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
        </div>
        {openStatusModal && branchData && branchData.status &&
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <DeactivationModal
                    title={ branchData?.status === 'inactive' ? 'Activate branch':'Deactivate branch'}
                    message={
                        `Are you sure you want to ${
                            branchData.status === 'active'? 'deactivate':'activate'
                        } this branch? ${
                            branchData.status === 'active' ? 'This would stop every activity in this branch.':''}`
                    }

                    buttonText={
                        branchData?.status === 'active'? 'Deactivate':'Activate'
                    }
                    buttonStyle={branchData?.status === 'active'? 'bg-error hover:bg-error-hover text-white':'bg-success hover:bg-success-hover text-white'}
                    onClose={() => {setOpenStatusModal(false); setDeactivationErrors([])}}
                    onConfirm={() => {handleChangeBranchStatus()}}
                    loadingText={branchData?.status === 'active'? 'Deactivating branch...':'Activating branch...'}
                    loading={loading}
                    deactivationErrors={deactivationErrors}
                />
            </div>
        }

        {openSuccessModal && branchData && branchData.status&& (
            <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
                <SuccessModal
                    title={branchData?.status === 'active'? 'Branch Deactivated': 'Branch Activated'}
                    message={`Branch successfully ${branchData?.status === 'active'? 'activated' : 'deactivated'}.`}
                    buttonStyle={'bg-success hover:bg-success-hover text-white'}
                    onClose={() =>{setOpenSuccessModal(false)}}
                    loading={loading}
                    loadingText={branchData?.status === 'active'? 'Deactivating branches...':'Activating branches...'}
                />
            </div>
        )}
    </div>
  )
}

export default ViewBranchDetails;