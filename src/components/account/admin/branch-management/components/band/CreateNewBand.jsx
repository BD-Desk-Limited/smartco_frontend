import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import SuccessModal from '@/components/account/SuccessModal';
import { getAllBranchesByCompanyId } from '@/services/branchServices';
import { verifyInputText } from '@/utilities/verifyInput';
import Image from 'next/image';
import React from 'react'

const CreateNewBand = ({onClose, bands, setBands, formData, setFormData}) => {

  const [allBranches, setAllBranches] = React.useState([]);
  const [newBand, setNewBand] = React.useState('');
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openPanel, setOpenPanel] = React.useState({});

  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranchesByCompanyId();
        if (response.error) {
          console.error('Error fetching branches:', response.error);
        };
        if (response.data) {
          setAllBranches(response.data);
        };
      } catch (error) {
        console.error('Error fetching branches:', error);
      };
    };
    fetchBranches();
  }, []);

  //aggregate all branches by bands
  const branchesByBand = allBranches.reduce((acc, branch) => {
    if (acc[branch.band]) {
      acc[branch.band].push(branch);
    } else {
      acc[branch.band] = [branch];
    };
    return acc;
  }, {});

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      //verify all inputs are filled
      if(!newBand){setError('Please enter a valid name for the new band'); return};

      if(newBand){
        // Validate input
        const passedValidation = verifyInputText(newBand);
        if (!passedValidation) {
          setError(passedValidation.message + 'For band name, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ?are not allowed.');
          return;
        };

        // Check if the band already exists
        const existingBands = bands.map(band => band.toLowerCase());
        if (existingBands.includes(newBand.toLowerCase())) {
          setError('This band already exists. Please choose a different name.');
          return;
        };

        //Create new band
        if (newBand && !existingBands.includes(newBand.toLocaleLowerCase())) {
          // Reset the form fields
          setBands([...bands, newBand]);
          setFormData({ ...formData, band: newBand });
          setError(null);
          setSuccess(true);
        };
      };
    }catch (err) {
      console.error(err);
      setError('An error occurred while creating a new band. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  //create a toggle state for each band. initially set to false
  const toggleOpenPanel = (band) => {
    setOpenPanel((prevState) => ({
      ...prevState,
      [band]: !prevState[band],
    }));
  };


  return (
    <div className='w-full h-full md:w-[80vw] md:h-[80vh] relative bg-white md:rounded-lg shadow-lg flex flex-col p-3 md:p-5 items-center overflow-y-auto'>
        <button 
            className='absolute top-2 right-2 bg-brand-gray rounded-[100%] px-4 py-2 text-text-white hover:bg-gray-shadow2 font-bold transition-all duration-300 ease-in-out'
            onClick={onClose}
            title='Close'
        >
            X
        </button>

        <h1 className='text-brand-blue font-bold text-base my-5'>Bands</h1>
        <div className='w-full md:h-full flex flex-col md:flex-row gap-5 md:gap-0 shadow-lg rounded-lg p-2 md:p-1 border-2 border-gray-border'>

          <form className='w-full md:w-[40%] text-sm' onSubmit={handleSubmit}>
            <h2 className='text-brand-blue text-base my-2 w-full text-center'>Create a new band</h2>
            <div className='flex flex-col w-full gap-5 md:h-full items-center justify-center'>
                <div className='flex flex-col gap-1 w-full md:w-[80%]'>
                    <label className='text-text-gray w-fit' htmlFor='name'>Band Name</label>
                    <input 
                        id='name'
                        type="text" 
                        placeholder="Enter Band Name" 
                        value={newBand}
                        className='border border-gray-border rounded-md p-2 w-full focus:ring-2 focus:ring-brand-blue focus:outline-none' 
                        onChange={(e) => setNewBand( e.target.value)}
                    />
                </div>
                
                  {error && <ErrorInterface error={error}/>}

                  <Button  
                    text={'Create Band'}
                    type={'submit'}
                    loading={loading}
                    loadingText={'Creating Band...'}
                    buttonStyle={`bg-brand-blue text-text-white px-4 py-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
                  />
              </div>
          </form>
            
            <span className='hidden md:block h-full w-0.5 bg-gray-border mx-1'></span>

            {/* Existing tax bands */}
            <div className='flex flex-col w-full md:w-[60%]'>
              <h2 className='text-brand-blue font-light w-full text-center'>Existing Bands</h2>
              <div className='text-text-white text-sm'>
                <div className='md:max-h-[50vh] overflow-y-auto relative'>
                  {
                    Object.keys(branchesByBand).length > 0 ? (
                      <ul className='flex flex-col gap-1 p-2 w-full'>
                        {Object.keys(branchesByBand).map((band) => (
                          <li key={band} className='border border-gray-border rounded-md overflow-hidden'>
                            <button
                              type='button'
                              onClick={() => toggleOpenPanel(band)}
                              aria-expanded={Boolean(openPanel[band])}
                              className='w-full min-h-10 px-3 py-2 bg-gray-shadow8 text-text-black hover:bg-gray-shadow9 flex items-center justify-between gap-2 text-left'
                            >
                              <strong>
                                {band} -
                                <span className='italic font-semibold text-error'> {branchesByBand[band].length}</span>
                              </strong>
                              <Image
                                src={openPanel[band] ? '/assets/arrow_down.png' : '/assets/arrow_left.png'}
                                alt=''
                                width={10}
                                height={10}
                              />
                            </button>
                            {openPanel[band] && (
                              <ul className='divide-y divide-gray-border'>
                                <li className='hidden sm:flex px-3 py-1 bg-blue-shadow10 text-text-gray text-xs font-semibold'>
                                  <span className='w-1/2'>Branch Name</span>
                                  <span>Branch ID</span>
                                </li>
                                {branchesByBand[band].map((branch, index) => (
                                  <li key={index} className='px-3 py-2 flex flex-col sm:flex-row text-text-gray'>
                                    <span className='sm:w-1/2 text-text-black'>{branch.name}</span>
                                    <span className='text-xs sm:text-sm'>{branch.branchId}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    ):(
                      <div className='flex flex-col gap-2 p-2'>
                        There are no existing bands yet. Please create a new band.
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
        </div>

      {success && 
        <div className='inset-0 bg-black bg-opacity-80 w-full h-full rounded-lg flex items-center justify-center z-[70] fixed'>
          < SuccessModal 
            message={'Band created successfully!'}
            subText={'Your new band would be assigned to the new branch. please note that the band would not be saved in the system until the branch is created.'}
            onClose={() => {
              onClose(); 
              setSuccess(false)
            }}
            buttonText={'Ok'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      }
    </div>
  )
}

export default CreateNewBand;