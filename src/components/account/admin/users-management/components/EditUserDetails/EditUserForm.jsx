import Image from 'next/image';
import React from 'react'

const EditUserForm = ({userData}) => {
  const [updatedUserData, setUpdatedUserData] = React.useState({});
  const [openImageUploadModal, setOpenImageUploadModal] = React.useState(false);
  const [imageFile, setImageFile] = React.useState(null);
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
        });
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      setOpenImageUploadModal(false);
      setUploadError(null);
    }
  };
  
  return (
    <div className='bg-white shadow-md rounded-lg p-2 relative'>
      {openImageUploadModal? (
        <div className='flex flex-col gap-2 items-center justify-center h-full my-20 '>
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
        <div className='flex flex-row gap-3 items-center my-10'>
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
      
      <ul className='flex flex-col px-5 gap-2 text-text-gray'>
        <li className='text-lg font-semibold'>{userData?.fullName}</li>
        <li className=''>{userData?.staffId}</li>
        <li className=''>{userData?.email}</li>
        <li className=''>{userData?.phoneNumber}</li>
        {userData?.team && 
          <li className=''>
            <strong>Team/Department:</strong> 
            {userData?.team?.name}
          </li>
        }
      </ul>
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