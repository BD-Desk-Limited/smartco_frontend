import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import { createMaterialCategories, createMaterialUnits } from '@/services/materialServices';
import { verifyInputText } from '@/utilities/verifyInput';
import Image from 'next/image';
import React from 'react'

const EditGroupedMaterialForm = (
    {
      updatedMaterialData = {}, 
      setUpdatedMaterialData,
      allCategories = [],
      setAllCategories,
      allUnits,
      setAllUnits, 
      allMaterials = [],
      newMaterialImage,
      setNewMaterialImage,
      error, 
      setError,
      loading,
      setLoading,
    }
) => {

    const [newCategory, setNewCategory] = React.useState('');
    const [newUnit, setNewUnit] = React.useState('');
    const [cantFindCategory, setCantFindCategory] = React.useState(false);
    const [createdNewCategory, setCreatedNewCategory] = React.useState(false);
    const [cantFindUnit, setCantFindUnit] = React.useState(false);
    const [createdNewUnit, setCreatedNewUnit] = React.useState(false);
    const [uploadNewImage, setUploadNewImage] = React.useState(false);
    const [newComponentMaterial, setNewComponentMaterial] = React.useState('');
    const [newComponentQuantity, setNewComponentQuantity] = React.useState(0);

    const allTypes = ['raw-material', 'packaging'];

    //filter out deleted materials from allMaterials
    const allMaterialsNotDeleted = allMaterials.filter(material => !material.isDeleted && material._id !== updatedMaterialData._id);

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

    const handleAddComponent = () => {
        setError('');
        if (!newComponentMaterial || !newComponentQuantity) {
          setError('Please select a component material and enter a quantity');
          return;
        };
    
        if (updatedMaterialData.components.find(component => component.id === newComponentMaterial)) {
          setError('Component material already added');
          return;
        };
    
        const component = {
          id: newComponentMaterial,
          quantity: newComponentQuantity,
          isGroup: allMaterials.find(material => material._id === newComponentMaterial)?.isGroup, 
        };
    
        setUpdatedMaterialData({
          ...updatedMaterialData,
          components: [...updatedMaterialData.components, component],
        });
    
        setNewComponentMaterial('');
        setNewComponentQuantity('');
    };

  return (
    <form className='flex flex-col gap-5 w-[65%] max-h-[75vh] overflow-auto scrollbar-thin p-5'>
        <div className='flex flex-row justify-between gap-10'>
            <div className='flex w-[40%]'>
                <div className='flex flex-col justify-start items-center w-full'> 
                  {uploadNewImage?
                    <div className='flex flex-col gap-1 w-full justify-center items-center'>
                      <div className='flex flex-col justify-center items-center w-full'>
                        {newMaterialImage && 
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
                        accept='image/*'
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
                        src={updatedMaterialData.imageURL || '/assets/edit-material.png'}
                        alt={updatedMaterialData.name || 'Material Image'}
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
            <div className='flex flex-col gap-5 w-full'>
                <div className='flex flex-col gap-0.5 w-full'>
                  <label className='text-sm'>Material Name</label>
                  <input
                    type='text'
                    value={updatedMaterialData.name || ''}
                    placeholder='Enter material name'
                    onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, name: e.target.value })}
                    className='border border-gray-border rounded-md w-full h-9 p-1 focus:outline-none focus:border-gray-shadow2'
                  />
                </div>
                <div className='flex flex-col gap-0.5'>
                  <label className='text-sm'>Material type</label>
                  <select
                    value={updatedMaterialData.materialType || ''}
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

                <div className='flex flex-col gap-0.5 w-full'>
                  <label className='text-sm'>Material Description</label>
                  <textarea
                    type='text'
                    value={updatedMaterialData.description || ''}
                    placeholder='Enter material description'
                    onChange={(e) => setUpdatedMaterialData({ ...updatedMaterialData, description: e.target.value })}
                    className='border border-gray-border rounded-md w-full h-32 p-1 focus:outline-none focus:border-gray-shadow2'
                  />
                </div>
            </div>
        </div>
        <div className='w-full flex justify-center items-center'>
          {error && <ErrorInterface error={error}/>}
        </div>

        <div className='flex items-center justify-center bg-gray-shadow9 w-full p-3 rounded-md'>
            <div className='flex flex-col items-center justify-center gap-2 w-full'>
              <h2 className='text-text-black text-md text-center'>
                Add a new component materials for your grouped material. After you have finished, click submit on the summary panel on the right to update the material. 
              </h2>
              <div className='flex flex-row gap-3 items-center'>
                <div>
                  <label className='text-text-black text-sm'>Add component Materials</label>
                  <select 
                    onChange={(e) => setNewComponentMaterial(e.target.value)}
                    value={newComponentMaterial || ''}
                    className='border border-gray-border rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-text-gray'
                  >
                    <option value={''} className='text-text-gray bg-opacity-30 hover:bg-blue-shadow5'>Select Material</option>
                    {
                      allMaterialsNotDeleted && 
                      allMaterialsNotDeleted.length > 0 &&
                      allMaterialsNotDeleted.map((material) => (
                        <option key={material._id} value={material._id}>
                          {material.name}
                        </option>
                    ))}
                  </select>
                </div>
                <div className='flex flex-col gap-1'>
                  <label className='text-text-black text-sm'>Unit</label>
                  <span className='border border-gray-border rounded-md p-1 h-full w-full focus:outline-none focus:ring-1 focus:ring-text-gray'>
                    {
                      allMaterials.find((
                        material
                      ) => material._id === newComponentMaterial)?.unitOfMeasurement?.name || 'Unit'
                    }
                  </span>
                </div>
                <div>
                  <label className='text-text-black text-sm'>Quantity</label>
                  <input
                    type='number'
                    placeholder='0.00'
                    min={0}
                    value={newComponentQuantity || ''}
                    onChange={(e) => setNewComponentQuantity(e.target.value)}
                    className='border border-gray-border rounded-md p-1 w-full focus:outline-none focus:ring-1 focus:ring-text-gray'
                  />
                </div>
              </div>
              <Button
                buttonStyle={'bg-primary text-white w-fit'}
                text={'Add Component'}
                onClick={handleAddComponent}
              />

            </div>
        </div>
    </form>
  )
}

export default EditGroupedMaterialForm; 