import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import SuccessModal from '@/components/account/SuccessModal';
import { createTaxBand } from '@/services/branchServices';
import { verifyInputText } from '@/utilities/verifyInput';
import React from 'react'

const CreateNewTaxBand = ({onClose, taxBands, setTaxBands, formData, setFormData}) => {

  const [newTaxBand, setNewTaxBand] = React.useState({
      name: '',
      rate: 0,
      description: ''
  });
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  //validate input
  let inputValidationErrors = [];
  const handleValidation = (input, message) => {
    if (!input) {
      inputValidationErrors.push(message);
    }else{
      const verifyInput = verifyInputText(input);
      if (!verifyInput.passed) {
        inputValidationErrors.push(verifyInput.message+ ' ' + message);
      };
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      //verify all inputs are filled
      if(!newTaxBand.name){setError('Please enter a valid name for the tax band'); return};
      if(!newTaxBand.rate){setError('Please enter a valid rate for the tax band'); return;}
      if(!newTaxBand.description){setError('Please enter a valid description for the tax band'); return;}

      if(newTaxBand.name && newTaxBand.rate && newTaxBand.description){
        // Validate input
        handleValidation(newTaxBand.name, 'For tax band name, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ?are not allowed.');
        handleValidation(newTaxBand.rate, 'For tax band rate, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ?are not allowed.');
        handleValidation(newTaxBand.description, 'For tax band description, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ?are not allowed.');
        if (inputValidationErrors.length > 0) {
          setError(inputValidationErrors[0]);
          return;
        };

        // Create new tax band
        const response = await createTaxBand(newTaxBand);

        if (response.error) {
          setError(response.error || 'An error occurred while creating the tax band. Please try again later.');
          setSuccess(false);
          return;
        };
        if (response.data) {
          setSuccess(true);
          // Reset the form fields
          setTaxBands([...taxBands, response.data]);
          setFormData({...formData, taxBand: response.data.name});
          setNewTaxBand({
            name: '',
            rate: 0,
            description: ''
          });
          setError(null);
          setSuccess(true);
        };
          
      }
    }catch (err) {
      console.error(err);
      setError('An error occurred while creating the tax band. Please try again later.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='w-[80vw] h-[80vh] relative bg-white rounded-lg shadow-lg flex flex-col p-5 items-center'>
        <button 
            className='absolute top-0.5 right-0.5 bg-brand-gray rounded-[100%] px-4 py-2 text-text-white hover:bg-gray-shadow2 font-bold transition-all duration-300 ease-in-out'
            onClick={onClose}
            title='Close'
        >
            X
        </button>

        <h1 className='text-brand-blue font-bold my-5'>Tax Bands</h1>
        <div className='w-full h-full flex flex-row shadow-lg rounded-lg p-1 border-2 border-gray-border'>

          <form className='w-[50%] text-sm' onSubmit={handleSubmit}>
            <h2 className='text-brand-blue font-light w-full text-center'>Create New Tax Band</h2>
            <div className='flex flex-col w-full gap-5 h-full items-center justify-center'>
                <div className='flex flex-col gap-1 w-[80%]'>
                    <label className='text-text-gray w-fit' htmlFor='name'>Tax Band Name</label>
                    <input 
                        id='name'
                        type="text" 
                        placeholder="Enter Band Name" 
                        value={newTaxBand.name}
                        className='border border-gray-border rounded-md p-2 w-full focus:ring-2 focus:ring-brand-blue focus:outline-none' 
                        onChange={(e) => setNewTaxBand({...newTaxBand, name: e.target.value})}
                    />
                </div>
                <div className='flex flex-col gap-1 w-[80%]'>
                    <label className='text-text-gray text-sm w-fit' htmlFor='rate'>{`Tax Rate (%)`}</label>
                    <input 
                        id='rate'
                        type="number"
                        value={newTaxBand.rate}
                        min={0} 
                        max={100}
                        step={0.01}
                        placeholder="Tax Rate(%)" 
                        className='w-full p-2 border border-gray-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none' 
                        onChange={(e) => setNewTaxBand({...newTaxBand, rate: e.target.value})}
                    />
                </div>
                <div className='flex flex-col gap-1 w-[80%]'>
                    <label className='text-text-gray text-sm w-fit' htmlFor='description'>Description</label>
                    <textarea 
                        id='description'
                        type="text"
                        placeholder="Description" 
                        value={newTaxBand.description}
                        className='w-full h-24 p-2 border border-gray-border rounded-lg mb-2 focus:ring-2 focus:ring-brand-blue focus:outline-none'
                        onChange={(e) => setNewTaxBand({...newTaxBand, description: e.target.value})}
                    />
                </div>
                  {error && <ErrorInterface error={error}/>}
                  <Button  
                    text={'Create Tax Band'}
                    type={'submit'}
                    loading={loading}
                    loadingText={'Creating Tax Band...'}
                    buttonStyle={`bg-brand-blue text-text-white px-4 py-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
                  />
              </div>
          </form>
            
            <span className='h-full w-0.5 bg-gray-border mx-1'></span>

            {/* Existing tax bands */}
            <div className='flex flex-col w-[50%]'>
                <h2 className='text-brand-blue font-light w-full text-center'>Existing Tax Bands</h2>
                <div className='text-text-white text-sm'>
                  <div className='max-h-[60vh] overflow-y-auto scrollbar-thin'>
                    <table className='w-full relative'>
                      <thead className='bg-blue-shadow3 text-text-white text-sm sticky top-0'>
                        <tr>
                          <th className='p-1'>Band Name</th>
                          <th className='p-1 w-24 text-left'>Tax Rate</th>
                          <th className='p-1'>Description</th>
                        </tr>
                      </thead>
                      <tbody className='text-brand-blue text-sm'>
                        {taxBands?.length>0?(
                          taxBands.map((band, index) => (
                            <tr key={index} className='border-b border-gray-border hover:bg-gray-border cursor-pointer'>
                              <td className='p-1'>{band.name}</td>
                              <td className='p-1'>{band.rate}%</td>
                              <td className='p-1'>{band.description}</td>
                            </tr>
                          ))
                        ):(
                            <tr className='border-b border-gray-border hover:bg-gray-border cursor-pointer'>
                                <td className='py-10 font-semibold text-center' colSpan={3}>You have no existing tax band please create a tax band!!!</td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
        </div>

      {success && 
        <div className='inset-0 bg-black bg-opacity-80 w-full h-full rounded-lg flex items-center justify-center z-70 absolute'>
          < SuccessModal 
            message={'Tax band created successfully!'}
            subText={'You can now assign this tax band to your branches.'}
            onClose={() => {
              onClose(); 
              setSuccess(false)
            }}
            buttonText={'Close'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      }
    </div>
  )
}

export default CreateNewTaxBand;