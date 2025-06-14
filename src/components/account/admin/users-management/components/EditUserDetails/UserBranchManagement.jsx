import { getAllBranchesByCompanyId } from '@/services/branchServices';
import Image from 'next/image';
import React, { useEffect } from 'react';

const UserBranchManagement = ({updatedUserData, setUpdatedUserData}) => {

  const [branches, setBranches] = React.useState([]);
  const [allBranches, setAllBranches] = React.useState([]);
  
  useEffect(() => {
    setBranches(updatedUserData?.branch || []);
  }, [updatedUserData]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranchesByCompanyId();
        if (response && response.data) {
          const formattedResponse = response.data?.map(branch => ({
            _id: branch._id,
            name: branch.name,
            address: branch.address,
          }) )
          setAllBranches(formattedResponse || []);
        } else {
          console.error("No branches found or invalid response format.");
        }
      }
      catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const addBranch = (branchId) => {
    const selectedBranch = allBranches.find(branch => branch._id === branchId);
    if (selectedBranch && !branches.some(branch => branch._id === selectedBranch._id)) {
      setBranches(prev => prev? [...prev, selectedBranch] : [selectedBranch]);
      setUpdatedUserData(prev => (prev?.branch? { ...prev, branch: [...prev.branch, selectedBranch] } : {...prev, branch: [selectedBranch] }));
    }
    // Reset the select input after adding
    document.querySelector('select').value = '';
  };

  const branchesNotAddedYet = allBranches.filter(branch => !branches.map(b => b._id).includes(branch._id))

  const removeBranch = (branchId) => {
    const updatedBranches = branches.filter(branch => branch._id !== branchId);
    setBranches(updatedBranches);
    setUpdatedUserData(prev => ({ ...prev, branch: updatedBranches }));
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-5 mr-10 relative h-full'>
      <h1 className='text-brand-blue font-semibold'>User Branches</h1>
      <div>
        <p className='text-text-gray text-sm mt-2'>Branches associated with the user.</p>
        {branches?.length < 1 ?(
            <li className='text-text-gray w-full text-center p-2 rounded-md list-none my-10'>
              No branches associated with this user yet.
            </li>
          ):
          <ul className='w-full px-2 rounded-lg shadow-sm my-2 py-5 grid grid-cols-4 gap-2 min-h-[150px] relative'>
            <span className='absolute top-0 right-2 text-brand-blue text-sm'>Number of branches - {branches && branches.length}</span>
            {branches  && (
              branches.map((branch) => (
                <li 
                  key={branch._id} 
                  title={branch.address}
                  className='flex items-center justify-between w-fit h-fit gap-2 bg-blue-shadow9 px-2 rounded-md cursor-default'
                >
                  <span className='text-text-black'>{branch?.name?.toLowerCase()}</span>
                  <Image
                   src={`/assets/cancel_blue.png`}
                   alt='Remove Branch'
                   width={16}
                   height={16}
                   title='Remove Branch'
                   className='cursor-pointer'
                   onClick={() => removeBranch(branch._id)}
                  />
                </li>
              ))
            )}
          </ul>
        }
      </div>

      {/* list all available branches */}
      <div className='mt-5'>
        <span className='flex items-center justify-center w-fit'>
          <Image
            src={`/assets/add_blue.png`}
            alt='Add Branch'
            width={20}
            height={20}
            title='Add Branch'
          />
          <span className='text-text-gray font-semibold ml-2'>Add Branch</span>
        </span>
        <select 
          className='w-full p-2 rounded-md border border-border-gray my-5 text-text-gray focus:outline-none focus:border-brand-blue cursor-pointer'
          onChange={(e)=> addBranch(e.target.value)}
        >
          <option value=''>Select Branch</option>
          {allBranches && branchesNotAddedYet.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default UserBranchManagement;