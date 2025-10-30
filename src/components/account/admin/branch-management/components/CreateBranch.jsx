import React from 'react';
import Header from '@/components/account/Header';
import SubHeader from '../../../SubHeader';
import PageDescription from '@/components/account/PageDescription';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import { verifyInputText } from '@/utilities/verifyInput';
import SuccessModal from '@/components/account/SuccessModal';
import BranchSidebar from './BranchSideBar';
import Image from 'next/image';
import CreateNewBand from './band/CreateNewBand';
import CreateNewTaxBand from './band/CreateNewTaxBand';
import { createBranchService, getAllBranchBandsByCompanyId, getAllTaxBandsByCompanyId } from '@/services/branchServices';
import { validateEmail, validatePhoneNumber } from '@/utilities/validateInput';
import WarningModal from '@/components/account/WarningModal';
import BulkBranchUploadModal from './BulkBranchUploadModal';

const bandDescription = `Band is used to group branches that share similar attributes, such as having the same sales price. This grouping helps organize branches logically based on shared characteristics, making it easier to manage and apply consistent rules or operations to them. For example:
If you have multiple branches selling a product at the same price, you can group them into a single band. This allows you to manage pricing or promotions for all branches in that band collectively.
This is different from a tax-band. A tax-band is a separate concept. It groups branches based on their tax rate rather than their sales price. This classification is useful for tax-related calculations and compliance.

Key Difference:
Band: Groups branches by shared attributes like sales price.
Tax-band: Groups branches by shared tax rates.`;

const taxBandDescription = `Tax band is a classification system used to categorize branches based on their applicable tax rates. It helps in determining the correct tax rate for each branch based on its location or other relevant factors. For example:
If you have branches in different regions with varying tax rates, you can assign them to different tax bands. This ensures that each branch applies the correct tax rate when calculating taxes on sales or other transactions.`;


const CreateBranch = ({pageDescription}) => {
  const selectedSubMenu = {
    name: 'View all branches',
    link: '/create-branch',
  };
  
  const [formData, setFormData] = React.useState({
    name: '',
    branchId: '',
    address: '',
    email: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [bands, setBands] = React.useState([]);
  const [taxBands, setTaxBands] = React.useState([]);
  const [showBandInfo, setShowBandInfo] = React.useState(false);
  const [showTaxBandInfo, setShowTaxBandInfo] = React.useState(false);
  const [createNewBand, setCreateNewBand] = React.useState(false);
  const [createNewTaxBand, setCreateNewTaxBand] = React.useState(false);
  const [openSubmitModal, setOpenSubmitModal] = React.useState(false);
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
  const [openBulkUploadModal, setOpenBulkUploadModal] = React.useState(false);
  
  React.useEffect(() => {
    const fetchBands = async () => {
      try{
        const response = await getAllBranchBandsByCompanyId();
        if (response.data) {
          setBands(response.data);
        };
      }
      catch(err){
        console.error('Error:', err);
      };
    };
    fetchBands();
  }, []);

  React.useEffect(() => {
    const fetchTaxBands = async () => {
      try{
        const response = await getAllTaxBandsByCompanyId();
        if (response.data) {
          setTaxBands(response.data);
        };
      }
      catch(err){
        console.error('Error:', err);
      };
    };
    fetchTaxBands();
  }, []);

  const handleOpenSubmitModal = (e) => {
    e.preventDefault();
    setError(null);
    // Validate form fields
    let inputValidationErrors = [];
    const handleValidation = (input, message) => {
      if (!input) {
        inputValidationErrors.push(`plase fill in all fields`);
      }else{
        const verifyInput = verifyInputText(input);
        if (!verifyInput.passed) {
          inputValidationErrors.push(verifyInput.message+ ' ' + message);
        };
      }
    };
    handleValidation(formData.name, 'For branch name, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.');
    handleValidation(formData.branchId, 'For branch ID, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.');
    handleValidation(formData.address, 'For branch address, special characters like @, #, $, %, ^, &, *, (, ), +, =, <, >, ? are not allowed.');
    if(!formData.email || !validateEmail(formData.email).isValid) {inputValidationErrors.push('Please enter a valid email address')};
    if(!formData.phoneNumber || !validatePhoneNumber(formData.phoneNumber).isValid) {inputValidationErrors.push('Please enter a valid international phone number. e.g +234 123 4567')};
    if(!formData.band) {inputValidationErrors.push('Please select a band, or create a new one')};
    if(!formData.taxBand) {inputValidationErrors.push('Please select a tax band, or create a new one')};
    if (inputValidationErrors.length > 0) {
      setError(inputValidationErrors[0]);
      return;
    }
    // If all validations pass, proceed with form submission
    setOpenSubmitModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    //assign the tax rate to the body of the request for the tax band selected
    const body = [{
      ...formData,
      taxRate: taxBands.find(band => band.name === formData.taxBand)?.rate,
    }];

    try {
      setLoading(true);
      const response = await createBranchService(body);
      if (response.error) {
        setError(response.error || 'An error occurred while creating the branch. Please try again later.');
        return;
      }
      if (response.data) {
        setOpenSuccessModal(true);
        setFormData({
          name: '',
          branchId: '',
          address: '',
          email: '',
          phoneNumber: '',
          band: '',
          taxBand: '',
        });
      };
    }
    catch (error) {
    }
    finally{
      setLoading(false);
      setOpenSubmitModal(false);
    }
  };
  
  return (
    <div className='relative'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Create New Branch'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <BranchSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>

        <div className="flex flex-col w-full h-full relative">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full">
            <div className="flex flex-row justify-between items-center w-full">
              <div>
                <h1 className="font-bold text-text-black">Create a new branch in your company</h1>
                <span className="text-sm text-text-gray font-thin">
                  Let&apos;s add a new branch...
                </span>
              </div>
              <button
                className='bg-brand-green text-text-white rounded-md px-5 py-2 hover:bg-opacity-90'
                onClick={() => setOpenBulkUploadModal(true)}
              >
               Create Branches in Bulk
              </button>
            </div>
            <form onSubmit={handleOpenSubmitModal} className="flex flex-col gap-5 my-5 w-full text-text-gray">
              <div className="flex flex-row gap-10 w-full">
                {/* Col 1 */}
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="branchId" className="text-sm font-semibold">Branch ID</label>
                    <input 
                      type="text" 
                      id="branchId" 
                      name="branchId" 
                      value={formData.branchId} 
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} 
                      placeholder="e.g. BR-1234"
                      className="border border-gray-border rounded-md p-2 w-fit focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="name" className="text-sm font-semibold">Branch Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="e.g. Main Branch"
                      className="border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="phoneNumber" className="text-sm font-semibold">Branch Phone Number</label>
                    <input 
                      type="phone"
                      id="phoneNumber" 
                      name="phoneNumber" 
                      value={formData.phoneNumber} 
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                      placeholder="e.g. +234 123 4567"
                      className="border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                    />
                    </div>
                </div>

                {/* Col 2 */}
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="email" className="text-sm font-semibold">Branch Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      placeholder='example@gmail.com'
                      className="border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="address" className="text-sm font-semibold">Branch Address</label>
                    <textarea 
                      type="address" 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                      placeholder="e.g. 123 Main St, City, Country"
                      className="border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm h-28 text-text-gray focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Bands and taxband*/}
              <div className="flex flex-row gap-10 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="bands" className="text-sm font-semibold">Branch Band</label>
                  {showBandInfo? (
                    <span 
                      onMouseLeave={()=>setShowBandInfo(false)} 
                      className='border-brand-blue shadow-md rounded-md p-2 w-fit text-sm text-text-black italic bg-gray-shadow9'
                    >
                      {bandDescription}
                    </span>
                    ):
                    <div className="flex flex-row gap-2 w-full">
                      <select 
                        id="bands" 
                        name="bands" 
                        value={formData.band} 
                        onChange={(e) => setFormData({ ...formData, band: e.target.value })} 
                        className="border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                      >
                        {bands && bands.length>0 ?
                          <>
                            <option value={""} className='opacity-50 bg-brand-blue'>Select branch Band</option>
                            {bands.map((band, index) => (
                              <option key={index} value={band}>{band}</option>
                            ))}
                          </>: 
                          <option value="" disabled>No band available</option>
                        }
                      </select>
                      <Image
                        src={"/assets/info.png"}
                        alt="info"
                        width={35}
                        height={16}
                        className="cursor-pointer"
                        title='What is a band?'
                        onClick={() => setShowBandInfo(true)}
                      />
                    </div>
                  }
                  <span 
                    onClick={()=>setCreateNewBand(true)} 
                    className='text-sm hover:underline cursor-pointer w-fit text-brand-blue'
                  >
                    create a new band
                  </span>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="bands" className="text-sm font-semibold">Branch Tax Band</label>
                  {showTaxBandInfo? (
                    <span 
                      onMouseLeave={()=>setShowTaxBandInfo(false)} 
                      className='border-brand-blue shadow-md rounded-md p-2 w-fit text-sm text-text-black italic bg-gray-shadow9'
                    >
                      {taxBandDescription}
                    </span>
                    ):
                    <div className="flex flex-row gap-2 w-full">
                      <select 
                        id="tax-bands" 
                        name="tax-bands" 
                        value={formData?.taxBand? formData.taxBand : " "} 
                        onChange={(e) => setFormData({ ...formData, taxBand: e.target.value })} 
                        className="border border-gray-border rounded-md p-2 w-full focus:outline-none text-sm text-text-gray focus:ring-2 focus:ring-brand-blue"
                      >
                        {taxBands && taxBands.length>0 ? 
                          (<>
                            <option value={""} className='opacity-50 bg-brand-blue'>Select Tax-Band</option>
                            {taxBands.map((band, index) => (
                              <option key={index} value={band.name}>{band.name}</option>
                            ))}
                          </>) : 
                          <option value="" disabled>No tax band available</option>
                        }
                      </select>
                      <Image
                        src={"/assets/info.png"}
                        alt="info"
                        width={35}
                        height={16}
                        className="cursor-pointer"
                        title='What is a tax band?'
                        onClick={() => setShowTaxBandInfo(true)}
                      />
                    </div>
                  }
                  <span 
                    onClick={()=>setCreateNewTaxBand(true)} 
                    className='text-sm hover:underline cursor-pointer w-fit text-brand-blue'
                  >
                    create a new Tax band
                  </span>
                </div>
              </div>

              {error && <ErrorInterface error={error}/>}

              {/* Buttons */}
              <div className='w-full flex justify-center items-center my-5'>
                <Button 
                  type={'submit'}  
                  text={'Create Branch'}
                  buttonStyle={'w-fit px-5'}
                />
              </div>

            </form>

          </div>
          <div className='sticky bottom-0 w-full'>
            <PageDescription 
              pageDescription={pageDescription} 
            />
          </div>
        </div>
      </div>
      {openBulkUploadModal && (
        <div className="inset-0 bg-black bg-opacity-70 fixed z-50 flex justify-center items-center flex-col">
          <div
            className="bg-gray-shadow2 text-text-white cursor-pointer py-3 px-5 m-1 rounded-[100%] hover:bg-gray-shadow5"
            onClick={() => setOpenBulkUploadModal(false)}
            title="close"
          >
            X
          </div>
          <BulkBranchUploadModal />
        </div>
      )}
      {createNewBand && 
        <div className='inset z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-70'>
          <CreateNewBand 
            onClose={()=>setCreateNewBand(false)}
            bands={bands}
            setBands={setBands}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      }

      {createNewTaxBand && 
        <div className='inset z-50 flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-70'>
          <CreateNewTaxBand 
            onClose={()=>setCreateNewTaxBand(false)}
            taxBands={taxBands}
            setTaxBands={setTaxBands}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      }
      {openSubmitModal &&
        <div className='inset-0 bg-black bg-opacity-80 w-full h-full rounded-lg flex items-center justify-center z-70 absolute'>
          <WarningModal 
            title={'Create a new Branch'}
            message={'Are you sure you want to create this branch?'}
            subText={'Please check that all information is correct.'}
            imageSrc={'/assets/warning.png'}
            button1Text={'Proceed'}
            button2Text={'Cancel'}
            onClick={handleSubmit}
            loading={loading}
            loadingText={'Creating branch...'}
            onClose={() => setOpenSubmitModal(false)}
            button2Style={`bg-error text-text-white p-2 rounded-lg hover:bg-opacity-80 transition-all duration-100 ease-in-out hover:bg-error`}
            button1Style={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-300 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      }
      {openSuccessModal &&
        <div className='inset-0 bg-black bg-opacity-80 w-full h-full rounded-lg flex items-center justify-center z-70 absolute'>
          <SuccessModal 
            title={'Branch Created'}
            message={'Branch created successfully!'}
            subText={'Your branch is now active. you can now assign team members to this branch.'}
            onClose={() => setOpenSuccessModal(false)}
            buttonText={'Close'}
            buttonStyle={`bg-brand-blue text-text-white p-2 rounded-lg hover:bg-blue-shadow3 transition-all duration-200 ease-in-out hover:bg-blue-shadow4`}
          />
        </div>
      }
    </div>
  )
}

export default CreateBranch;
