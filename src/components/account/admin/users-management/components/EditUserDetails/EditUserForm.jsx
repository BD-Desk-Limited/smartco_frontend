import Image from 'next/image';
import React from 'react'

const EditUserForm = ({userData, updatedUserData, setUpdatedUserData, handleUpdateUser}) => {
  const [openImageUploadModal, setOpenImageUploadModal] = React.useState(false);
  const [uploadError, setUploadError] = React.useState(null);
  
  const handlefileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUserData({
          ...updatedUserData,
          profilePictureUrl: reader.result,
          imageFile: file, // Store the file for upload
        });
      };
      reader.readAsDataURL(file);
      setOpenImageUploadModal(false);
      setUploadError(null);
    }
  };
  
  return (
    <div className='bg-white shadow-md rounded-lg p-2 relative'>
      {openImageUploadModal? (
        <div className='flex flex-col gap-2 items-center justify-center h-full my-10 '>
          <h1 className='text-text-gray text-base font-semibold'>Upload Profile Picture</h1>
          <span className='flex flex-row gap-2 items-center justify-center w-full'>
            <input 
              type="file"
              accept="image/*"
              onChange={handlefileChange}
              className='h-full w-full cursor-pointer'
            />
            <span onClick={()=>setOpenImageUploadModal(false)} className='p-1 rounded-lg shadow-lg text-sm bg-gray-shadow4 text-gray-shadow10 cursor-pointer'>Cancel</span>
          </span>
          {uploadError && <span> {uploadError}</span> }
        </div>
      ):(
        <div className='flex flex-row gap-3 items-center my-5'>
         <Image
           src={updatedUserData?.profilePictureUrl || '/assets/anonymous.png'}
           alt={'user'}
           width={100}
           height={100}
           className='rounded-full p-1 object-cover max-h-50 max-w-50 shadow-brand-green shadow-sm hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'
           onClick={() => {setOpenImageUploadModal(true)}}
         />
         <span 
          className='text-brand-blue hover:underline font-semibold cursor-pointer'
          onClick={() => {setOpenImageUploadModal(true)}}
         >
          {updatedUserData?.profilePictureUrl? "Change picture" : "Upload picture"}
         </span>
        </div>
      )}
      
      <form onSubmit={handleUpdateUser} className='flex flex-col p-5 gap-3 text-text-gray'>
        <span className='font-semibold'>Staff I D: {userData?.staffId}</span>
        <label htmlFor='fullName' className='text-sm font-semibold'>Full Name
        <input 
          type='text'
          id='fullName'
          onChange={(e) => setUpdatedUserData({ ...updatedUserData, fullName: e.target.value })}
          value={updatedUserData?.fullName || ''}
          className='mt-1 border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue'
        />
        </label>
        <label htmlFor='email' className='text-sm font-semibold'>Email
        <input
          type='email'
          id='email'
          onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
          value={updatedUserData?.email || ''}
          className='mt-1 border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue'
        />
        </label>
        <label htmlFor='phoneNumber' className='text-sm font-semibold'>Phone Number
        <input
          type='text'
          id='phoneNumber'
          onChange={(e) => setUpdatedUserData({ ...updatedUserData, phoneNumber: e.target.value })}
          value={updatedUserData?.phoneNumber || ''}
          className='mt-1 border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue'
        />
        </label>
        <label htmlFor='team' className='text-sm font-semibold'>Team/Department
        <input
          type='text'
          id='team'
          onChange={(e) => setUpdatedUserData({ ...updatedUserData, team: e.target.value })}
          value={updatedUserData?.team?.name || ''}
          className='mt-1 border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue'
        />
        </label>
      </form>
      <p className={`absolute top-1 right-1 px-2 shadow-black shadow-sm text-white italic rounded-full ${
        userData.role=== 'admin'? 'bg-error': 
        userData?.role === 'manager'? 'bg-brand-blue' : 'bg-brand-gray'
        }`}
      >
        {userData?.role}
      </p>
    </div>
  );
}

export default EditUserForm;