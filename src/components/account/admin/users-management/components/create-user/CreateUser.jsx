import Header from '@/components/account/Header'
import SubHeader from '@/components/account/SubHeader'
import React from 'react'
import UsersManagementSidebar from '../UsersManagementSidebar'
import PageDescription from '@/components/account/PageDescription';
import CreateUserForm from './CreateUserForm';
import { motion } from 'framer-motion';
import UserBranchManagement from '../EditUserDetails/UserBranchManagement';
import Button from '@/components/account/Button';
import WarningModal from '@/components/account/WarningModal';
import { verifyEmail, verifyInputText, verifyPhoneNumber } from '@/utilities/verifyInput';
import ErrorInterface from '@/components/account/errorInterface';
import { createUserService } from '@/services/usersServices';
import SuccessModal from '@/components/account/SuccessModal';
import SelectUserTeam from './SelectUserTeam';

const CreateUser = ({pageDescription}) => {

  const selectedSubMenu = {
      name: 'Users Management',
      icon: '/assets/user.png',
      iconActive: '/assets/user_active.png',
      link: '/users-management',
      title: 'Users Management',
    };
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [formData, setFormData] = React.useState({
    staffId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    team: '',
    branch: [],
  });
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const roles = [
    {name: 'seller', style: `bg-brand-blue`},
    {name: 'manager', style: `bg-brand-green`},
    {name: 'admin', style: `bg-error`},
  ];

  const handleOpenModal = () => {

    setError(null);

    // Validate form fields
    let inputValidationErrors = [];

    // validate staff ID
    const validateStaffId = verifyInputText(formData.staffId);
    if (!formData.staffId || formData.staffId.length < 3 || !validateStaffId.passed) {
      inputValidationErrors.push('Please enter a valid staff ID with at least 3 alpha-numeric characters only.');
    };

    // validate role
    if (!formData.role || formData.role.length === 0) {
      inputValidationErrors.push('Please select a valid role for the user.');
    };

    // validate email
    const validateEmail = verifyEmail(formData?.email);
    if (!validateEmail.passed) {
      inputValidationErrors.push(validateEmail.message + ' Please enter a valid email address.');
    };

    // validate phone number
    if (!formData?.phoneNumber || !verifyPhoneNumber(formData.phoneNumber).passed) {
      inputValidationErrors.push(verifyPhoneNumber(formData.phoneNumber).message + ' Please enter a valid phone number.');
    };

    // validate full name
    const validateFullName = verifyInputText(formData.fullName);
    if (!validateFullName || !validateFullName.passed) {
      inputValidationErrors.push(validateFullName.message + ' Please enter a valid full name.');
    };

    // validate team for admin role
    const validateTeam = verifyInputText(formData.team?.name);
    if (formData.team && (!validateTeam.passed)) {
      inputValidationErrors.push(validateTeam.message + ' Please enter a valid team name.');
    };

    // validate branch for seller and manager roles
    if ((formData.role === 'seller' || formData.role === 'manager') && (!formData.branch || formData.branch.length === 0)) {
      inputValidationErrors.push('Please select at least one branch for the user.');
    };

    if (inputValidationErrors.length > 0) {
      setError(inputValidationErrors[0]);
      setOpenModal(false);
      return;
    };

    setOpenModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);

    const body = {
      staffId: formData.staffId,
      role: formData.role,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      branch: formData.branch?.map((branch) => branch?.name.toLowerCase()) || [],
      team: formData.team?.name || null
    };

    console.log('Creating user with data:', body);

    try{
      setLoading(true);
      const response = await createUserService(body);

      if(response.error){
        setError(response.error.message);
        return;
      }

      if(response.data){
        setSuccess(true);
        setError(null);
        setFormData({
          staffId: '',
          fullName: '',
          email: '',
          phoneNumber: '',
          role: '',
          team: '',
          branch: [],
        });
      }
    }
    catch (err) {
      console.error('Error updating user data:', err);
      setError('Failed to update user details. Please try again later.');
    }
    finally{
      setLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'Create a new User'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <UsersManagementSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-[70vh] overflow-y-auto scrollbar-thin flex flex-col gap-5 text-text-gray relative">
            <span 
              onClick={() => window.href = '/pages/account/admin/users-management/create-bulk-user'}
              className='flex flex-col gap-1 w-52 absolute top-10 right-10'
            >
              <span 
                onClick={() => window.location.href = '/pages/account/admin/users-management/create-bulk-user'}
                className='bg-brand-green hover:bg-green-shadow1 px-4 py-2 rounded-md shadow-md text-white text-center cursor-pointer'
              >
                Create users in bulk
              </span> 
              <span className='text-sm text-text-black text-center'>
                Only seller and manager roles can be created in bulk.
              </span>
            </span>
            <form className='flex flex-col gap-5'>
              <div className='flex flex-col gap-2'>
                <span>Select type of account to create</span>
                <span className='flex flex-row gap-5 p-5'>
                  {roles.map((role) => (
                    <span 
                      key={role?.name} 
                      onClick={() => setFormData({...formData, role: role?.name})}
                      className={`${formData.role && formData.role !== role?.name ? 'opacity-40 bg-brand-gray' : `${role?.style || ' '}`} rounded-md px-5 py-2 text-base shadow-md cursor-pointer hover:shadow-lg transition-all duration-5000 ease-in-out hover:scale-[130%] text-text-white `}
                    >
                      {role?.name?.charAt(0).toUpperCase() + role?.name?.slice(1)}
                    </span>
                  ))}
                </span>
              
              </div>
              
              {formData?.role &&
                <div className='flex flex-row gap-5 w-full h-full'>
                  <motion.div
                    initial={{ x: '100%', opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    className='w-[50%]'
                  >
                    <CreateUserForm 
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </motion.div>

                  { formData?.role !== 'admin'?
                    <motion.div
                      initial={{ x: '100%', opacity: 0, scale: 0.95 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                      className='w-[50%]'
                    >
                      <UserBranchManagement
                        updatedUserData={formData}
                        setUpdatedUserData={setFormData}
                      />
                    </motion.div>:
                    <motion.div
                      initial={{ x: '100%', opacity: 0, scale: 0.95 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                      className='w-[50%]'
                    >
                      <SelectUserTeam
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </motion.div>
                  }
                </div>
              }
            </form>
          </div>
          {error && <div className='my-2'><ErrorInterface error={error}/></div>}
          {formData?.role &&
            <div className='flex justify-center items-center my-2'>
              <Button 
                text={'Create User'}
                buttonStyle={`mx-5`}
                onClick={handleOpenModal}
                loading={loading}
                loadingText={'Creating User...'}
                type={'submit'}
              />
            </div>
          }
          <div className=''><PageDescription pageDescription={pageDescription}/></div>
        </div>
      </div>

      {/* Modal for confirmation of user creation */}
      {openModal &&
        <div className='inset-0 z-50 flex justify-center items-center absolute bg-black bg-opacity-80'>
        <WarningModal
          title={`Create new user?`}
          message={`Are you sure you want to create this user.`}
          button1Style={`bg-brand-blue hover:bg-blue-shadow1`}
          button2Style={`bg-brand-gray hover:bg-gray-shadow1`}
          button1Text={`Create User`}
          button2Text={`Cancel`}
          onClick={handleCreateUser}
          onClose={() => setOpenModal(false)}
          subText={`This action cannot be undone. Please ensure that all information is correct before proceeding.`}
          loading={loading}
          loadingText={`Creating User...`}
          imageSrc={`/assets/warning.png`}
        />
      </div>}

      {success &&
        <div className='inset-0 z-50 flex justify-center items-center absolute bg-black bg-opacity-80'>
          <SuccessModal
            title={`Create new user`}
            message={`The user has been created successfully.`}
            subText={`You can now view the user in the users management section.`}
            buttonText={`OK`}
            buttonStyle={`bg-brand-blue hover:bg-blue-shadow1 text-white`}
            onClose={() => {
              setSuccess(false);
              setOpenModal(false);
            }}
          />
        </div>
      }
    </div>
  )
}

export default CreateUser;