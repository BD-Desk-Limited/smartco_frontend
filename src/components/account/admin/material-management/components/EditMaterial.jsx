import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/account/Header';
import SubHeader from '../../../SubHeader';
import MaterialSidebar from './materialSidebar';
import { createMaterialCategories, createMaterialUnits, getMaterialCategories, getMaterialUnits, updateMaterial, } from '@/services/materialServices';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import SuccessModal from '@/components/account/SuccessModal';
import { verifyInputText } from '@/utilities/verifyInput';

const EditMaterial = ({ materialData, pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const selectedSubMenu = {
    name: 'View All Materials',
    link: '/view-materials',
  };

  const [updatedMaterialData, setUpdatedMaterialData] = React.useState({});
  const [allCategories, setAllCategories] = React.useState([]);
  const [allUnits, setAllUnits] = React.useState([]);
  const [cantFindUnit, setCantFindUnit] = React.useState(false);
  const [cantFindCategory, setCantFindCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [createdNewCategory, setCreatedNewCategory] = React.useState(false);
  const [createdNewUnit, setCreatedNewUnit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [newUnit, setNewUnit] = React.useState('');
  const [newMaterialImage, setNewMaterialImage] = React.useState(null);
  const [uploadNewImage, setUploadNewImage] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const router = useRouter();


  const allTypes = ['raw-material', 'packaging'];

  React.useEffect(() => {
    setUpdatedMaterialData(materialData);
  }, [materialData]);

  React.useEffect(() => {
    // Fetch all categories
    const fetchAllCategories = async () => {
      try {
        const response = await getMaterialCategories();
        if (response.data) {
          setAllCategories(response.data);
        };
      } catch (err) {
        console.error(err)
      };
    };
    fetchAllCategories();
  }, []);

  React.useEffect(() => {
    // Fetch all units
    const fetchAllUnits = async () => {
      try {
        const response = await getMaterialUnits();
        if (response.data) {
          setAllUnits(response.data);
        };
      } catch (err) {
        console.error(err)
      };
    };
    fetchAllUnits();
  }, []);

  const handleCreateCategory = async () => {
    
    const verifyInput = verifyInputText(newCategory);
    if (!verifyInput.passed) {
      setError(verifyInput.message);
      return;
    };
    
    setLoading(true);
    // Create new category
    try {
      const response = await createMaterialCategories({ name: newCategory });
      if (response.data) {
        setCreatedNewCategory(true);
        setAllCategories([...allCategories, response.data.category]);
        setUpdatedMaterialData({ ...updatedMaterialData, category: response.data.category });
      };
    } catch (err) {
      console.error(err)
    };
    setLoading(false);
  };

  const handleCreateUnit = async () => {
    const verifyInput = verifyInputText(newUnit);
    if (!verifyInput.passed) {
      setError(verifyInput.message);
      return;
    };
    
    setLoading(true);
    // Create new unit
    try {
      const response = await createMaterialUnits({ name: newUnit });
      if (response.data) {
        setCreatedNewUnit(true);
        setAllUnits([...allUnits, response.data.unit]);
        setUpdatedMaterialData({ ...updatedMaterialData, unitOfMeasurement: response.data.unit });
      };
    } catch (err) {
      console.error(err)
    };
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    };
    setNewMaterialImage(file);
  };

  const handleUpdateMaterial = async () => {

    // Validate form fields
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

    handleValidation(updatedMaterialData.name, 'Please enter a valid material name');
    handleValidation(updatedMaterialData.description, 'Please enter a valid material description');
    handleValidation(updatedMaterialData.materialType, 'Please select a valid material type');
    handleValidation(updatedMaterialData.category.name, 'Please select a valid material category');
    handleValidation(updatedMaterialData.unitOfMeasurement.name, 'Please select a valid unit of measurement');
    if (inputValidationErrors.length > 0) {
      setError(inputValidationErrors[0]);
      return;
    };

    if (materialData === updatedMaterialData && !newMaterialImage) {
      setError('You have not made any changes to the material');
      return;
    };

    // Update material details
    const body = {
      name: updatedMaterialData.name,
      description: updatedMaterialData.description,
      materialType: updatedMaterialData.materialType,
      category: updatedMaterialData.category._id,
      unitOfMeasurement: updatedMaterialData.unitOfMeasurement._id,
      imageUrl: materialData?.imageURL || null,
    };
  
    // Call API to update material
    setLoading(true);
    try {
      const response = await updateMaterial(materialData._id, body, newMaterialImage);
      if (response.data) {
        newCategory && setAllCategories([...allCategories, response.data.category]);
        newUnit && setAllUnits([...allUnits, response.data.unit]);
        setShowSuccessModal(true);
      }else{
        setError(response.error || 'Error updating material, please try again');
      };
    } catch (err) {
      console.error('Error updating material', err);
      setError('Error updating material, please try again');
    }finally{
      setLoading(false);
    };
  };

  return (
    <div className='w-full'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'Edit Material'} />
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <MaterialSidebar
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full text-text-gray">
            <h1 className='font-bold text-lg'>{materialData.name}</h1>
            <span className='text-sm'>Edit this material in your stores, Click on any field to update</span>
            <div className='flex flex-row gap-5 mt-5'>
              <form className='flex flex-row justify-between gap-10 w-[70%]'>
                <div className='flex flex-col gap-5 w-full'>
                  <div className='flex flex-col gap-0.5 w-full'>
                    <label className='text-sm'>Material Name</label>
                    <input
                      type='text'
                      defaultValue={updatedMaterialData.name}
                      onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, name: e.target.value })}
                      className='border border-gray-border rounded-md w-full h-9 p-1 focus:outline-none focus:border-gray-shadow2'
                    />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <label className='text-sm'>Material type</label>
                    <select
                      value={updatedMaterialData.materialType}
                      onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, materialType: e.target.value })}
                      className='border border-gray-border rounded-md w-full h-9 focus:outline-none focus:border-gray-shadow2'
                    >
                      {allTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  {createdNewCategory?
                    <div className='w-full text-center px-5'>
                      <span className='text-center text-success text-sm w-full'>
                        New category created successfully. New category will be associated with this material when updated
                      </span>
                    </div>:
                    <>
                      {cantFindCategory ?
                        <div className='flex flex-col gap-0.5'>
                          <label className='text-sm'>Material Category</label>
                          <div className='flex flex-row gap-2 justify-between items-center'>
                            <input
                              type='text'
                              placeholder='Enter new category'
                              onChange={(e) => setNewCategory(e.target.value)}
                              className='border border-gray-border rounded-md w-full h-9 p-1 text-text-gray focus:outline-none focus:border-gray-shadow2'
                            />
                            <Button
                              text={'create category'}
                              buttonStyle={'text-sm p-1'}
                              loading={loading}
                              onClick={handleCreateCategory}
                              loadingText={'Creating...'}
                            />
                          </div>
                          <span
                            onClick={() => setCantFindCategory(false)}
                            className='text-sm text-brand-blue hover:text-blue-shadow4 cursor-pointer'
                          >
                            Select from existing categories
                          </span>
                        </div> :
                        <div className='flex flex-col gap-0.5'>
                          <label className='text-sm'>Material Category</label>
                          <select
                            value={updatedMaterialData.category?._id}
                            onChange={(e) => {
                              const selectedCategory = allCategories.find(category => category._id === e.target.value);
                              setUpdatedMaterialData({ ...updatedMaterialData, category: selectedCategory });
                            }}
                            className='border border-gray-border rounded-md w-full h-9 focus:outline-none focus:border-gray-shadow2'
                          >
                            {allCategories?.map((category, index) => (
                              <option key={index} value={category?._id}>{category?.name}</option>
                            ))}
                          </select>
                          <span onClick={() => setCantFindCategory(true)} className='text-sm text-brand-blue hover:text-blue-shadow4 cursor-pointer'>
                            Can&apos;t find the right category?
                          </span>
                        </div>
                      }
                    </>
                  } 
                </div>
                <div className='flex flex-col gap-5 w-full'>
                  <div className='flex flex-col gap-0.5 w-full'>
                    <label className='text-sm'>Material Description</label>
                    <textarea
                      type='text'
                      value={updatedMaterialData.description}
                      onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, description: e.target.value })}
                      className='border border-gray-border rounded-md w-full h-32 p-1 focus:outline-none focus:border-gray-shadow2'
                    />
                  </div>
                  {createdNewUnit?
                    <div className='w-full text-center px-5'>
                      <span className='text-center text-success text-sm w-full'>
                        New unit created successfully. New unit will be associated with this material when updated
                      </span>
                    </div>:
                    <>{cantFindUnit ?
                      <div>
                        <label className='text-sm'>Unit of Measurement</label>
                        <div className='flex flex-row gap-2 justify-between items-center'>
                          <input
                            type='text'
                            placeholder='Enter new unit'
                            onChange={(e) => setNewUnit(e.target.value)}
                            className='border border-gray-border rounded-md w-full h-9 p-1 text-text-gray focus:outline-none focus:border-gray-shadow2'
                          />
                          <Button
                            text={'create unit'}
                            buttonStyle={'text-sm p-1'}
                            loading={loading}
                            onClick={handleCreateUnit}
                            loadingText={'Creating...'}
                          />
                        </div>
                        <span
                          onClick={() => setCantFindUnit(false)}
                          className='text-sm text-brand-blue hover:text-blue-shadow4 cursor-pointer'
                        >
                          Select from existing units
                        </span>
                      </div> :
                      <div className='flex flex-col gap-0.5'>
                        <label className='text-sm'>Unit of Measurement</label>
                        <select
                          value={updatedMaterialData.unitOfMeasurement?._id}
                          onChange={(e) => {
                            const selectedUnit = allUnits.find(unit => unit._id === e.target.value);
                            setUpdatedMaterialData({ ...updatedMaterialData, unitOfMeasurement: selectedUnit });
                          }}  
                          className='border border-gray-border rounded-md h-9 focus:outline-none focus:border-gray-shadow2'
                        >
                          {allUnits?.map((unit, index) => (
                            <option key={index} value={unit?._id}>{unit?.name}</option>
                          ))}
                        </select>
                        <span onClick={() => setCantFindUnit(true)} className='text-sm text-brand-blue hover:text-blue-shadow4 cursor-pointer'>
                          Can&apos;t find the right unit?
                        </span>
                      </div>  
                    }</>
                  }
                </div>
              </form>
              <div className='flex flex-col justify-center items-center gap-5 w-[30%]'> 
                {uploadNewImage?
                  <div className='flex flex-col gap-1 w-full justify-center items-center'>
                    <div className='flex flex-col justify-center items-center w-full gap-1'>
                      {newMaterialImage&& 
                        <Image 
                          src={URL.createObjectURL(newMaterialImage)} 
                          alt='Material Image'
                          height={150} 
                          width={150}
                          className='rounded-[100%] h-[150px] w-[150px]' 
                        />
                      }
                      
                    </div>
                    <input
                      type='file'
                      onChange={handleImageUpload}
                      className='border border-gray-border rounded-md w-full h-9 p-1 cursor-pointer focus:outline-none focus:border-gray-shadow2'
                    />
                    <span 
                      onClick={() => {setUploadNewImage(false); setNewMaterialImage(null)}}
                      className='text-sm text-brand-blue hover:font-semibold cursor-pointer'
                    >
                      cancel upload
                    </span>
                  </div>:
                  <div className='flex flex-col justify-center items-center w-full gap-1'>
                    <Image 
                      src={materialData.imageURL || '/assets/edit-material.png'}
                      alt={materialData.name || 'Material Image'}
                      width={200}
                      height={200}
                      className='rounded-[100%] h-[200px] w-[200px]'
                    />
                    <span 
                      onClick={() => setUploadNewImage(true)}
                      className='text-base text-center text-brand-blue w-full cursor-pointer hover:font-semibold'
                    >
                      Upload a new image
                    </span>
                  </div>
                }
              </div>
            </div>
            <div className='w-full mt-10'>
              {error && <ErrorInterface error={error}/>}
            </div>
            <div className='flex flex-row justify-center w-full gap-20 my-10 items-center'>
              <Button
                text={'Cancel'}
                buttonStyle={'text-sm px-5 border border-brand-blue  rounded-md'}
                onClick={() => {
                  setUpdatedMaterialData(materialData); 
                  setNewMaterialImage(null);
                  router.push('/pages/account/admin/manage-materials/view-materials');
                }}
              />
              <Button
                text={'Update Material'}
                buttonStyle={'text-sm p-2'} 
                onClick={handleUpdateMaterial}
                loading={loading}
                loadingText={'Updating...'}
              />
            </div>
          </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
      </div>
      {showSuccessModal && 
      <div className='inset-0 fixed z-70 flex justify-center items-center bg-black bg-opacity-50'>
        <SuccessModal 
          title={'Material Updated'}
          message={'success!!!'}
          subText={'Material has been updated successfully'}
          buttonText={'close'}
          buttonStyle={'hover:bg-blue-shadow2 p-2 bg-brand-blue text-white rounded-md'}
          onClose={() => router.push('/pages/account/admin/manage-materials/view-materials')}
        />
      </div>
      }
    </div>
  );
}

export default EditMaterial;
