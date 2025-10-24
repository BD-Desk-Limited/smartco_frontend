import Image from 'next/image';
import React from 'react'

const ProductAvailabilityDetails = ({ branches, setBranches, branchesProductIsAvailableIn, setProductData }) => {

    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredBranches, setFilteredBranches] = React.useState(branches);
    const [selectedFilter, setSelectedFilter] = React.useState('all');
    const [selectedBranches, setSelectedBranches] = React.useState([]);

    React.useEffect(() => {
        let filtered = branches.filter(branch => 
            branch.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedFilter === 'all') {
            filtered = filtered;
        } else if (selectedFilter === 'available'){
            filtered = filtered.filter(branch => branch._id && branchesProductIsAvailableIn.map(branch => branch.branch).includes(branch._id)) || [];
        } else if (selectedFilter === 'unavailable'){
            filtered = filtered.filter(branch => branch._id && !branchesProductIsAvailableIn.map(branch => branch.branch).includes(branch._id)) || [];
        }

        setFilteredBranches(filtered);
    }, [searchTerm, branches, selectedFilter, branchesProductIsAvailableIn]);
    
    const filterOptions = ['all', 'available', 'unavailable'];

    const handleFilterClick = (filterValue) => {
        setSelectedFilter(filterValue);
    };

    const handleSelectBranch = (branchId) => {
        let updatedSelectedBranches = [...selectedBranches];
        if (updatedSelectedBranches.includes(branchId)) {
            updatedSelectedBranches = updatedSelectedBranches.filter(id => id !== branchId);
        } else {
            updatedSelectedBranches.push(branchId);
        }
        setSelectedBranches(updatedSelectedBranches);
    };

  return (
    <div>
        <h3 className='flex flex-row justify-between items-center'>
          <span className='text-brand-blue font-semibold'>Availability</span>
          <span className='text-sm text-text-gray'>{branches.length || 0} {branches.length === 1 ? 'branch' : 'branches'}</span>
        </h3>

        <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm p-0.5 my-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />

        {/* filters for available and unavailable branches */}
        <div className='flex flex-row justify-between items-center'>
            <ul className='list-none flex flex-row gap-2'>
                {filterOptions.map((option, index) => (
                    <li key={index}>
                        <button
                            className={`px-2 py-1 rounded-full text-sm ${selectedFilter === option ? 'bg-brand-blue text-text-white' : 'bg-gray-200 text-text-gray'}`}
                            onClick={() => handleFilterClick(option)}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        {/* Quick actions for selected branches */}
        <div className='bg-text-white rounded-lg shadow-md text-sm text-text-gray flex flex-col gap-1 p-2 my-2'>
            <button className='hover:underline text-brand-blue'>Make available in all branches</button>
            <button className='hover:underline text-error'>Make unavailable in all branches</button>
            
            <hr className='my-2 border border-gray-shadow5'/>
            {selectedBranches.length > 0 && (
                <div className='relative flex flex-col'>
                    <div className='absolute top-[-20px] right-0 bg-error text-text-white rounded-full px-2 py-1 text-xs font-semibold'>
                        {selectedBranches.length} branch{selectedBranches.length !== 1 ? 'es' : ''} selected
                    </div>
                    <button className='hover:underline text-brand-blue'>Make available in selected branches</button>
                    <button className='hover:underline text-error'>Make unavailable in selected branches</button>
                </div>
            )}
        </div>

        {/* List of branches with availability status */}
        <ul className='list-none max-h-[80%] overflow-y-auto scrollbar-thin my-1'>
            
            {filteredBranches.length > 0 ? filteredBranches.map((branch, index) => (
                <li key={index} className='text-sm text-text-gray mb-1 flex flex-row justify-between items-center border-b border-gray-border py-1 hover:bg-gray-shadow9 px-2'>
                    
                    <span>
                        <input
                            type="checkbox"
                            checked={selectedBranches.includes(branch._id)}
                            onChange={() => handleSelectBranch(branch._id)}
                            className='mr-2'
                        />
                        {branch.name}
                    </span>
                    <span className={`text-xs ${branchesProductIsAvailableIn.map(branch => branch.branch).includes(branch._id) ? 'bg-success' : 'bg-error'} text-text-white rounded-full px-2 py-1`}>
                        {branchesProductIsAvailableIn.map(branch => branch.branch).includes(branch._id) ? 'Available' : 'Unavailable'}
                    </span>
                </li>
            )) : (
                <li className='text-sm text-text-gray py-10'>No branches found.</li>
            )}
        </ul>
    </div>
  )
}

export default ProductAvailabilityDetails