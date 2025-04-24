import Header from '@/components/account/Header';
import PageDescription from '@/components/account/PageDescription';
import SubHeader from '@/components/account/SubHeader';
import React from 'react'
import BranchSidebar from './BranchSideBar';
import { getAllBranchBandsByCompanyId, getAllTaxBandsByCompanyId } from '@/services/branchServices';
import Image from 'next/image';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import WarningModal from '@/components/account/WarningModal';
import SuccessModal from '@/components/account/SuccessModal';

const EditBranch = ({branchData, setBranchData, pageDescription}) => {

    const selectedSubMenu = {
        name: 'View all branches',
        link: '/',
    };
    const [openSidebar, setOpenSidebar] = React.useState(false);
    const [updatedBranchData, setUpdatedBranchData] = React.useState({});
    const [companyBand, setCompanyBand] = React.useState([]);
    const [companyTaxBands, setCompanyTaxBands] = React.useState([]);
    const [showTaxBandInfo, setShowTaxBandInfo] = React.useState(false);
    const [openSubmitModal, setOpenSubmitModal] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (branchData) {
            setUpdatedBranchData(branchData);
        };
    }, [branchData]);

    React.useEffect(() => {
        const fetchCompanyBand = async () => {
            try{
                const response = await getAllBranchBandsByCompanyId();
                if (response.data) {
                    setCompanyBand(response.data);
                }
                if (response.error) {
                    console.error('Error fetching company bands:', response.error);
                }
            }catch (error) {
                console.error('Error fetching company bands:', error);
            }
        }
        fetchCompanyBand();
    }, [branchData]);

    React.useEffect(() => {
        const fetchTaxBands = async () => {
            try{
                const response = await getAllTaxBandsByCompanyId();
                if (response.data) {
                    setCompanyTaxBands(response.data);
                }
                if (response.error) {
                    console.error('Error fetching tax bands:', response.error);
                }
            }catch (error) {
                console.error('Error fetching tax bands:', error);
            }
        }
        fetchTaxBands();
    }, [branchData]);

    const handleReset = () => {
        if(branchData === updatedBranchData) {
            setError('You have not made any changes to the branch information.');
            return;
        };
        setUpdatedBranchData(branchData);
        setError(null);
        setSuccess(null);
        setOpenSubmitModal(false);
    };

    const handleUpdateBranch = async () => {
        console.log('updatedBranchData', updatedBranchData);
    };


  return (
    <div className='max-h-screen overflow-y-auto no-scrollbar w-full'>
        <div className="w-full sticky top-0 z-50">
          <Header />
        </div>
        <div className="w-full">
            <SubHeader title={'Edit branch information'}/>
        </div>
        <div className="flex flex-row gap-0 w-full h-full">
          <div className="min-w-fit">
            <BranchSidebar 
              selectedSubMenu={selectedSubMenu}
              isOpen={openSidebar}
              setIsOpen={setOpenSidebar}
            />
          </div>
          <div className='flex flex-col h-full text-text-gray relative'>
            <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
                <h1 className='text-sm'>Click on any field to update branch information</h1>
                <form className='flex flex-row justify-between gap-5'>
                    {/* Row 1 */}
                    <div className='flex flex-col gap-5 w-full'>
                        <div className='flex flex-row gap-5'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="branch-name" className='text-sm'>Branch I D</label>
                                <input
                                    type="text"
                                    value={updatedBranchData?.branchId || ''}
                                    disabled
                                    className='border border-gray-border rounded-md p-2 text-sm bg-gray-shadow9'
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm'>Branch Name:</label>
                            <input 
                                type="text" 
                                value={updatedBranchData?.name || ''} 
                                onChange={(e) => setUpdatedBranchData({...updatedBranchData, name: e.target.value})}
                                className='border border-gray-border rounded-md p-2 text-sm'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm'>Branch Address:</label>
                            <input 
                                type="text" 
                                value={updatedBranchData?.address || ''} 
                                onChange={(e) => setUpdatedBranchData({...updatedBranchData, address: e.target.value})}
                                className='border border-gray-border rounded-md p-2 text-sm'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm'>Branch Email:</label>
                            <input
                                type="text"
                                value={updatedBranchData?.email || ''}
                                onChange={(e) => setUpdatedBranchData({...updatedBranchData, email: e.target.value})}
                                className='border border-gray-border rounded-md p-2 text-sm'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm'>Branch Phone Number:</label>
                            <input 
                                type="text" 
                                value={updatedBranchData?.phoneNumber || ''} 
                                onChange={(e) => setUpdatedBranchData({...updatedBranchData, phoneNumber: e.target.value})}
                                className='border border-gray-border rounded-md p-2 text-sm'
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className='flex flex-col gap-5 min-h-full p-5 rounded-lg bg-gray-shadow9 w-full'>
                        <div className='flex flex-row gap-1 items-center'>
                            <label className='text-sm'>Band: </label>
                            <select
                                value={updatedBranchData?.band || ''}
                                onChange={(e) => setUpdatedBranchData({...updatedBranchData, band: e.target.value})}
                                className='border border-gray-border rounded-md p-2 text-sm'
                            >
                                {updatedBranchData&&
                                    updatedBranchData?.band ?
                                    <option value={updatedBranchData?.band}>{updatedBranchData?.band}</option>:
                                    <option value="">Select Band</option>
                                }
                                {companyBand.length>0? (
                                    companyBand.filter(band => band !== updatedBranchData?.band).map((band, index) => (
                                        <option key={index} value={band}>{band}</option>
                                    ))):
                                    <option value="">No bands available</option>
                                }
                            </select>
                        </div>
                        <div className='flex flex-row gap-1 items-center w-full'>
                            <label className='text-sm'>Tax Band: </label>
                            {showTaxBandInfo? (
                                <span className='bg-text-white rounded-md text-sm text-brand-blue italic p-2' onMouseLeave={() => setShowTaxBandInfo(false)}>
                                    {updatedBranchData?.taxBand?.description}
                                </span>
                            ):(
                            <>
                                <select
                                    value={updatedBranchData?.taxBand?.name || ''}
                                    onChange={(e) => setUpdatedBranchData({
                                        ...updatedBranchData, 
                                        taxBand: companyTaxBands.find(taxBand => taxBand.name === e.target.value)
                                    })}
                                    className='border border-gray-border rounded-md p-2 text-sm'
                                >
                                    {updatedBranchData&&
                                        updatedBranchData?.taxBand?.name?
                                        <option value={updatedBranchData?.taxBand.name}>{updatedBranchData?.taxBand?.name}</option>:
                                        <option value="">Select Tax Band</option>
                                    }
                                    {companyTaxBands.length>0? (
                                        companyTaxBands.filter(taxBand => taxBand.name !== updatedBranchData?.taxBand?.name).map((taxBand, index) => (
                                            <option key={index} value={taxBand?.name}>{taxBand?.name}</option>
                                        ))):
                                        <option value="">No tax bands available</option>
                                    } 
                                </select>
                                {updatedBranchData?.taxBand?.rate && !showTaxBandInfo && (
                                  <Image 
                                    src={`/assets/info.png`}
                                    alt="info"
                                    width={20}
                                    height={20}
                                    className='cursor-pointer'
                                    title={`${updatedBranchData?.taxBand?.rate}% click for more info`}
                                    onClick={()=>setShowTaxBandInfo(true)}
                                  />
                                )}
                            </>
                            )}
                        </div>
                        {/* Opening and Closing hours */}
                        <div className="flex flex-col gap-3 bg-white shadow-md p-2 rounded-lg">
                          <h1 className="text-sm">Opening and Closing Hours</h1>
                          <div className="flex flex-row gap-5">
                            {/* Opening Time */}
                            <div className="flex flex-col gap-1">
                              <label className="text-sm text-success">Opening Time:</label>
                              <TimePicker
                                onChange={(value) =>
                                  setUpdatedBranchData({ ...updatedBranchData, openingHour: value })
                                }
                                value={updatedBranchData?.openingHour || ''}
                                disableClock={true}
                                format="h:mm a"
                                className="text-sm"
                              />
                            </div>
                            
                            {/* Closing Time */}
                            <div className="flex flex-col gap-1">
                              <label className="text-sm text-error font-semibold">Closing Time:</label>
                              <TimePicker
                                onChange={(value) =>
                                  setUpdatedBranchData({ ...updatedBranchData, closingHour: value })
                                }
                                value={updatedBranchData?.closingHour || ''}
                                disableClock={true}
                                format="h:mm a"
                                className=" text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {error && <ErrorInterface error={error} />}

                        {/*Buttons*/}
                        <div className='flex flex-row justify-center gap-10 w-full my-2'>
                            <Button
                                text={'Save Changes'}
                                onClick={()=>setOpenSubmitModal(true)}
                                buttonStyle={'bg-brand-blue text-white rounded-md p-2 w-fit'}
                            />
                            <Button
                                text={'Reset Changes'}
                                onClick={handleReset}
                                buttonStyle={'bg-brand-gray rounded-md p-2 w-fit'}
                            />
                        </div>

                    </div>
                </form>
            
            </div>
            <div className='sticky bottom-0'><PageDescription pageDescription={pageDescription}/></div>
          </div>
        </div>

        {openSubmitModal &&
            <div className='inset z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-70'>
                <WarningModal
                    title={'Update Branch'}
                    message={'Are you sure you want to update this branch information?'}
                    imageSrc={'/assets/warning.png'}
                    button1Text={'Submit'}
                    button2Text={'Cancel'}
                    button1Style={'bg-brand-blue text-text-white'}
                    button2Style={'bg-brand-gray text-text-white'}
                    onClick={handleUpdateBranch}
                    onClose={() => setOpenSubmitModal(false)}
                    loadingText={'Updating...'}
                    subText={'This action will update the branch information in the system.'}
                />
            </div>
        }

        {success &&
            <div className='inset z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-70'>
                <SuccessModal
                    title={'Branch Updated'}
                    message={'Branch information has been updated successfully.'}
                    buttonText={'OK'}
                    buttonStyle={'bg-brand-blue text-text-white'}
                    onClose={() => {setSuccess(null); setOpenSubmitModal(false)}}
                />
            </div>
        }
    </div>
  )
}

export default EditBranch;
