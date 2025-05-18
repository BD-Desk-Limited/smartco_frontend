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
    <div className='w-[80vw] h-[80vh] relative bg-white rounded-lg shadow-lg flex flex-col p-5 items-center'>
        <button 
            className='absolute top-0.5 right-0.5 bg-brand-gray rounded-[100%] px-4 py-2 text-text-white hover:bg-gray-shadow2 font-bold transition-all duration-300 ease-in-out'
            onClick={onClose}
            title='Close'
        >
            X
        </button>

        <h1 className='text-brand-blue font-bold text-base my-5'>Bands</h1>
        <div className='w-full h-full flex flex-row shadow-lg rounded-lg p-1 border-2 border-gray-border'>

          <form className='w-[40%] text-sm' onSubmit={handleSubmit}>
            <h2 className='text-brand-blue text-base my-2 w-full text-center'>Create a new band</h2>
            <div className='flex flex-col w-full gap-5 h-full items-center justify-center'>
                <div className='flex flex-col gap-1 w-[80%]'>
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
            
            <span className='h-full w-0.5 bg-gray-border mx-1'></span>

            {/* Existing tax bands */}
            <div className='flex flex-col w-[60%]'>
              <h2 className='text-brand-blue font-light w-full text-center'>Existing Bands</h2>
              <div className='text-text-white text-sm'>
                <div className='max-h-[50vh] overflow-y-auto scrollbar-thin relative'>
                  {
                    Object.keys(branchesByBand).length > 0 ? (
                      <table className='flex flex-col gap-0.5 p-2 w-full'>
                        <thead className='bg-blue-shadow3 text-text-white text-sm sticky top-0'>
                          <tr className='flex flex-row gap-2'>
                            <th className='p-1 text-left w-[50%]'>Branch Name</th>
                            <th className='p-1 text-left'>Branch I D</th>
                          </tr>
                        </thead>
                        {
                          Object.keys(branchesByBand).map((band) => (
                            <tbody key={band} className='text-brand-blue font-light flex flex-col border border-gray-border rounded-sm mx-1'>
                              <tr 
                                className='bg-gray-shadow8 text-text-black hover:bg-gray-shadow9 cursor-pointer w-full rounded-t-sm border border-gray-border' 
                                onClick={()=>toggleOpenPanel(band)}
                              >
                                <td className='w-full flex flex-row items-center justify-between'>
                                  <strong className='w-full'>
                                    {band} - 
                                    <span className='italic font-semibold text-error'> {branchesByBand[band].length}</span>
                                  </strong>
                                  <Image
                                    src={openPanel[band] ? '/assets/arrow_down.png' : '/assets/arrow_left.png'}
                                    alt='arrow'
                                    width={10}
                                    height={10}
                                    className={`mt-2 mr-1 items-center transform -translate-y-1/2 transition-transform duration-200 ${openPanel[band] ? 'rotate-180' : ''}`}
                                    onClick={(e)=>{toggleOpenPanel(band); e.stopPropagation()}}
                                    title= {openPanel[band] ? 'Collapse' : 'Expand'}
                                  />
                                </td>
                              </tr>
                              {openPanel[band] && branchesByBand[band].map((branch, index) => (
                                <tr key={index} className=' hover:bg-gray-shadow10 cursor-pointer flex text-text-gray'>
                                  <td className='p-1 text-left w-[50%]'>{branch.name}</td>
                                  <td className='p-1 text-left'>{branch.branchId}</td>
                                </tr>
                              ))}
                            </tbody>
                          ))
                        }
                      </table>
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
        <div className='inset-0 bg-black bg-opacity-80 w-full h-full rounded-lg flex items-center justify-center z-70 absolute'>
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