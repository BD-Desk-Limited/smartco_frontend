import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import Image from 'next/image';
import Header from '@/components/account/Header';
import SubHeader from './SubHeader';
import MaterialSidebar from './materialSidebar';
import { createMaterialCategories, createMaterialUnits, getMaterialCategories, getMaterialUnits, updateMaterial, } from '@/services/materialServices';
import Button from '@/components/account/Button';

const EditMaterial = ({ materialData, pageDescription }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = React.useState({
    name: 'View All Materials',
    link: '/view-materials',
  });
  const [updatedMaterialData, setUpdatedMaterialData] = React.useState({
    name: materialData.name,
    description: materialData.description,
    materialType: materialData.materialType,
    category: materialData.category,
    unitOfMeasurement: materialData.unitOfMeasurement,
  });
  const [allCategories, setAllCategories] = React.useState([]);
  const [allUnits, setAllUnits] = React.useState([]);
  const [cantFindUnit, setCantFindUnit] = React.useState(false);
  const [cantFindCategory, setCantFindCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [createdNewCategory, setCreatedNewCategory] = React.useState(false);
  const [createdNewUnit, setCreatedNewUnit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [newUnit, setNewUnit] = React.useState('');
  const [newCategoryId, setNewCategoryId] = React.useState(null);
  const [newUnitId, setNewUnitId] = React.useState(null);
  const [newMaterialImage, setNewMaterialImage] = React.useState(null);
  const [uploadNewImage, setUploadNewImage] = React.useState(false);
  const allTypes = ['raw-material', 'packaging-material'];

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
    setLoading(true);
    // Create new category
    try {
      const response = await createMaterialCategories({ name: newCategory });
      if (response.data) {
        setCreatedNewCategory(true);
        setNewCategoryId(response?.data?.category?._id);
        setAllCategories([...allCategories, response.data.category]);
      };
    } catch (err) {
      console.error(err)
    };
    setLoading(false);
  };

  const handleCreateUnit = async () => {
    setLoading(true);
    // Create new unit
    try {
      const response = await createMaterialUnits({ name: newUnit });
      if (response.data) {
        setCreatedNewUnit(true);
        setNewUnitId(response?.data?.unit?._id);
        setAllUnits([...allUnits, response.data.unit]);
      };
    } catch (err) {
      console.error(err)
    };
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewMaterialImage(file);
  };

  const handleUpdateMaterial = async() => {
    // Update material details
    const updatedMaterial = {
      name: updatedMaterialData.name,
      description: updatedMaterialData.description,
      materialType: updatedMaterialData.materialType,
      category: createdNewCategory ? newCategoryId : updatedMaterialData.category._id,
      unitOfMeasurement: createdNewUnit ? newUnitId : updatedMaterialData.unitOfMeasurement._id,
      imageUrl: materialData?.imageURL || null,
    };

    // Upload image
    const formData = new FormData();
    formData.append('file', newMaterialImage);
    formData.append('data', JSON.stringify(updatedMaterial));
    console.log(formData);

    // Call API to update material
    
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
                      defaultValue={materialData.name}
                      className='border border-gray-border rounded-md w-full h-9 p-1'
                    />
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <label className='text-sm'>Material type</label>
                    <select
                      value={updatedMaterialData.materialType}
                      onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, materialType: e.target.value })}
                      className='border border-gray-border rounded-md w-full h-9'
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
                              className='border border-gray-border rounded-md w-full h-9 p-1 text-text-gray'
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
                            value={updatedMaterialData.category}
                            onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, category: e.target.value })}
                            className='border border-gray-border rounded-md w-full h-9'
                          >
                            {allCategories?.map((category, index) => (
                              <option key={index} value={category}>{category.name}</option>
                            ))}
                          </select>
                          <span onClick={() => setCantFindCategory(true)} className='text-sm text-brand-blue hover:text-blue-shadow4 cursor-pointer'>
                            Can't find category?
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
                      defaultValue={materialData.description}
                      onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, description: e.target.value })}
                      className='border border-gray-border rounded-md w-full h-32 p-1'
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
                            className='border border-gray-border rounded-md w-full h-9 p-1 text-text-gray'
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
                          value={updatedMaterialData.unitOfMeasurement}
                          onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, unitOfMeasurement: e.target.value })}
                          className='border border-gray-border rounded-md h-9'
                        >
                          {allUnits?.map((unit, index) => (
                            <option key={index} value={unit}>{unit.name}</option>
                          ))}
                        </select>
                        <span onClick={() => setCantFindUnit(true)} className='text-sm text-brand-blue hover:text-blue-shadow4 cursor-pointer'>
                          Can't find unit?
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
                          width={180} 
                          height={180} 
                          className='rounded-[100%] px-5' 
                        />
                      }
                      
                    </div>
                    <input
                      type='file'
                      onChange={handleImageUpload}
                      className='border border-gray-border rounded-md w-full h-9 p-1 cursor-pointer'
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
                      src={materialData.image || '/assets/edit-material.png'}
                      alt={materialData.name || 'Material Image'}
                      width={200}
                      height={200}
                      className='rounded-[100%]'
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
            <div className='flex flex-row justify-center w-full gap-20 my-20 items-center'>
              <Button
                text={'Cancel'}
                buttonStyle={'text-sm px-5 border border-brand-blue bg-text-white text-blue-700  rounded-md'}
                onClick={() => {setUpdatedMaterialData(materialData);}}
              />
              <Button
                text={'Update Material'}
                buttonStyle={'text-sm p-2'} 
                onClick={handleUpdateMaterial}
              />
            </div>
          </div>
          <PageDescription pageDescription={pageDescription} />
        </div>
      </div>
    </div>
  )
}

export default EditMaterial;