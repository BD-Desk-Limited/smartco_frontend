import React from 'react'
import UsersManagementSidebar from '../UsersManagementSidebar';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import PageDescription from '@/components/account/PageDescription';
import EditUserForm from './EditUserForm';
import UserPermissionsManagement from './UserPermissionsManagement';
import UserBranchManagement from './UserBranchManagement';
import { useAuth } from '@/contexts/authContext';
import Button from '@/components/account/Button';
import WarningModal from '@/components/account/WarningModal';
import ErrorInterface from '@/components/account/errorInterface';
import { updateUserService } from '@/services/usersServices';
import SuccessModal from '@/components/account/SuccessModal';
import { verifyEmail, verifyInputText, verifyPhoneNumber } from '@/utilities/verifyInput';
import { validateEmail, validatePhoneNumber } from '@/app/utilities/validateInput';

const EditUserDetails = ({pageDescription, userData}) => {
    
  const selectedSubMenu = {
    name: 'View All Users',
    link: '/',
  };
  const { user } = useAuth();
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [updatedUserData, setUpdatedUserData] = React.useState({});
  const [openConfirmationModal, setOpenConfirmationModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (userData) {
      setUpdatedUserData(userData);
    }
  }, [userData]);

  const handleOpenModal = () => {
    setError(null);
    if (userData === updatedUserData) {
      setError('You have not made any changes to the user details.');
      return;
    };

    // Validate form fields
    let inputValidationErrors = [];

    // validate email
    const validateEmail = verifyEmail(updatedUserData.email);
    if (!validateEmail.passed) {
      inputValidationErrors.push(validateEmail.message + ' Please enter a valid email address.');
    };

    // validate phone number
    if (updatedUserData.phoneNumber && !verifyPhoneNumber(updatedUserData.phoneNumber).passed) {
      inputValidationErrors.push(verifyPhoneNumber(updatedUserData.phoneNumber).message + ' Please enter a valid phone number.');
    };
    // validate full name
    const validateFullName = verifyInputText(updatedUserData.fullName);
    if (!validateFullName.passed) {
      inputValidationErrors.push(validateFullName.message + ' Please enter a valid full name.');
    };
    // validate team
    const validateTeam = verifyInputText(updatedUserData.team);
    if (updatedUserData.team && !validateTeam.passed) {
      inputValidationErrors.push(validateTeam.message + ' Please select a valid team name.');
    };

    if (inputValidationErrors.length > 0) {
      setError(inputValidationErrors[0]);
      setOpenConfirmationModal(false);
      return;
    };

    setOpenConfirmationModal(true);
  };

  const handleUserDataUpdate = async () => {

    const body = {
      fullName: updatedUserData.fullName,
      email: updatedUserData.email,
      phoneNumber: updatedUserData.phoneNumber,
      branch: updatedUserData.branch?.map((branch) => branch._id) || [],
      team: updatedUserData.team?._id || null,
      accessLevel: updatedUserData.accessLevel,
    };

    setError(null);

    try{
      setLoading(true);
      const response = await updateUserService(userData._id, body, updatedUserData?.imageFile || null);

      if(response.error){
        setError(response.error.message);
        return;
      }

      if(response.data){
        setSuccess(true);
        setError(null);
      }
    }
    catch (err) {
      console.error('Error updating user data:', err);
      setError('Failed to update user details. Please try again later.');
    }
    finally{
      setLoading(false);
      setOpenConfirmationModal(false);
    }
  };

  return (
    <div className='h-screen overflow-y-auto no-scrollbar relative'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full sticky top-14 bg-white z-50">
        <SubHeader title={'Update User Details'}/>
      </div>
      <div className="flex flex-row max-h-[85vh] overflow-y-auto scrollbar-thin gap-0 w-full h-full relative my-2">
        <div className="min-w-fit">
          <UsersManagementSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full overflow-y-auto no-scrollbar relative'>
          <h1 className='px-5 text-text-black'>Click on any field to update user details...</h1>
          <div className="mx-5 my-2 rounded-md h-full w-full flex flex-row justify-between gap-5 max-h-[calc(100vh-10rem)]">
            <div className='w-full max-h-auto overflow-y-auto scrollbar-thin' >
              <EditUserForm 
                userData={userData}
                updatedUserData={updatedUserData}
                setUpdatedUserData={setUpdatedUserData}
                handleUpdateUser={handleUserDataUpdate}
              />
            </div>
            {userData?.role === 'admin' && user?.superAdmin &&
              <div className='w-full h-auto'>
                <UserPermissionsManagement 
                  userData={userData} 
                  updatedUserData={updatedUserData}
                  setUpdatedUserData={setUpdatedUserData}
                />
              </div>
            }
            {userData?.role !== 'admin' &&
              <div className='w-full h-auto'>
                <UserBranchManagement 
                  userData={userData}
                  updatedUserData={updatedUserData}
                  setUpdatedUserData={setUpdatedUserData}
                />
              </div>
            } 
          </div>

          {error && <div className='my-2'><ErrorInterface error={error}/></div>}

          <div className='w-full flex justify-center items-center gap-10 my-2 px-5'>
            <Button 
              onClick={handleOpenModal}
              text={'Update User Details'}
            />
            <Button 
              onClick={() => window.history.back()}
              text={'Back'}
              buttonStyle='bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 rounded-md px-4 py-2 px-5'
            />
          </div>

          <div className=''><PageDescription pageDescription={pageDescription}/></div>
        </div>
      </div>

      { openConfirmationModal && (
        <div className='inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80'>
          <WarningModal
            message={'Are you sure you want to update the user details?'}
            title={'Update User Details'}
            onClose={() => setOpenConfirmationModal(false)}
            onClick={handleUserDataUpdate}
            button1Text={'Yes, Update'}
            button2Text={'No, Cancel'}
            button1Style={'text-white hover:bg-blue-shadow5 rounded-md px-4 py-2'}
            button2Style={'bg-gray-shadow5 text-text-black hover:bg-gray-shadow4 rounded-md px-4 py-2'}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
      { success && (
        <div className='inset-0 z-50 flex justify-center items-center fixed bg-black bg-opacity-80'>
          <SuccessModal
            message={'User details updated successfully!'}
            title={'Success'}
            onClose={() => {setSuccess(false); window.history.back();}}
            buttonText={'OK'}
            buttonStyle={'text-white bg-brand-blue hover:bg-blue-shadow5 rounded-md px-4 py-2'}
          />
        </div>
      )}
    </div>
  )
}

export default EditUserDetails;