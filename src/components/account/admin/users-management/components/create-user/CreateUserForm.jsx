import React from 'react';

const CreateUserForm = ({formData, setFormData}) => {

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col w-full'>
        <label className='text-sm'>Staff ID</label>
        <input 
          type="text" 
          value={formData.staffId} 
          onChange={(e) => setFormData({...formData, staffId: e.target.value})} 
          className='border border-brand-gray rounded-md px-3 py-2 focus:outline-none focus:border-brand-blue transition-all duration-300 ease-in-out w-full'
        />
      </div>
      <div className='flex flex-col w-full'>
        <label className='text-sm'>Full Name</label>
        <input 
          type="text" 
          value={formData.fullName} 
          onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
          className='border border-brand-gray rounded-md px-3 py-2 focus:outline-none focus:border-brand-blue transition-all duration-300 ease-in-out'
        />
      </div>
      <div className='flex flex-col w-full'>
        <label className='text-sm'>Email</label>
        <input 
          type="email" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          className='border border-brand-gray rounded-md px-3 py-2 focus:outline-none focus:border-brand-blue transition-all duration-300 ease-in-out'
        />
      </div>
      <div className='flex flex-col w-full'>
        <label className='text-sm'>Phone Number</label>
        <input 
          type="tel" 
          value={formData.phoneNumber} 
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
          className='border border-brand-gray rounded-md px-3 py-2 focus:outline-none focus:border-brand-blue transition-all duration-300 ease-in-out'
        />
      </div>
    </div>
  )
}

export default CreateUserForm;