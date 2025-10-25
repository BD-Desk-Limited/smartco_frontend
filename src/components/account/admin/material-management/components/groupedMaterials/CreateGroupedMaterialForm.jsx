import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import React from 'react'

const CreateGroupedMaterialForm = ({formData, setFormData, allMaterials, allCategories, allUnits}) => {
  const [newComponentMaterial, setNewComponentMaterial] = React.useState('');
  const [newComponentQuantity, setNewComponentQuantity] = React.useState('');
  const [cantFindCategory, setCantFindCategory] = React.useState(false);
  const [cantFindUnit, setCantFindUnit] = React.useState(false);
  const [error, setError] = React.useState('');

  // Filter out deleted materials from allMaterials
  const allMaterialsNotDeleted = allMaterials&& allMaterials.filter(material => !material.isDeleted);

  const handleAddComponent = () => {
    setError('');
    if (!newComponentMaterial || !newComponentQuantity) {
      setError('Please select a component material and enter a quantity');
      return;
    };

    // Check if component material is already added
    const isAlreadyAdded = formData.components.some(component => component.id === newComponentMaterial);
    if (isAlreadyAdded) {
      setError('Component material already added');
      return;
    };

    const component = {
      id: newComponentMaterial,
      quantity: parseFloat(newComponentQuantity),
      isGroup: allMaterials.find(material => material._id === newComponentMaterial)?.isGroup, 
    };

    setFormData({
      ...formData,
      components: [...formData.components, component],
    });

    setNewComponentMaterial('');
    setNewComponentQuantity('');
  };


  return (
    <form className="flex flex-col gap-5 my-5 bg-white p-10 rounded-md w-full max-h-[80vh] overflow-y-auto scrollbar-thin">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="font-bold">Creating grouped material</h1>
          <span className="text-sm text-text-gray font-thin">
            Let&apos;s create a grouped material for your store...
          </span>
        </div>

        <div className='flex flex-col justify-between gap-5'>
          <div className='flex flex-row gap-10'>
            <div className='flex flex-col gap-5 w-[50%]'>
              <div>
                <label className='text-text-gray text-sm'>Grouped Material Name</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='Enter grouped material name'
                  className='border border-gray-border text-text-gray rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-text-gray'
                />
              </div>

              <div>
                <label className='text-text-gray text-sm'>Material Unit of Measurement</label>
                {cantFindUnit? (
                  <div className='flex flex-col gap-1 items-left'>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="Enter new Unit"
                      className="border border-gray-border rounded-md p-2 focus:outline-none text-text-gray"  
                    />
                    <span 
                      onClick={() => {setCantFindUnit(false); setFormData({...formData, unit: ''})}}
                      className="text-brand-blue cursor-pointer text-sm font-semibold"
                    >
                      Select from existing units
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 items-left">
                    <select
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      value={formData.unit}
                      className="border border-gray-border rounded-md p-2 focus:outline-none text-text-gray"  
                    >
                      <option value={''}>Select Material Unit</option>
                      {allUnits &&
                        allUnits?.map((unit) => (
                          <option key={unit._id} value={unit.name}>
                            {unit?.name}
                          </option>
                      ))}
                    </select>
                    <span 
                      onClick={() => {setCantFindUnit(true); setFormData({...formData, unit: ''})}}
                      className="text-brand-blue cursor-pointer text-sm font-semibold"
                    >
                      Can&apos;t find unit?
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className='text-text-gray text-sm'>Material Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Enter material description'
                  className='border border-gray-border text-text-gray rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-text-gray'
                />
              </div>
            </div>

            <div className='flex flex-col gap-8 w-[50%] mt-2'>
              <div className="flex flex-col gap-1">
                <label className="text-text-gray text-sm">Material Type</label>
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, materialType: e.target.value })
                  }
                  value={formData.materialType}
                  className="border border-gray-border rounded-md p-2 focus:outline-none text-text-gray"
                >
                  <option value="" className="bg-brand-blue text-sm">
                    Select Material Type
                  </option>
                  <option value="raw-material">Raw Material</option>
                  <option value="packaging">Packaging material</option>
                </select>
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-text-gray text-sm'>Material Category</label>
                {cantFindCategory? (
                  <div className='flex flex-col gap-1 items-left'>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="Enter new Category"
                      className="border border-gray-border rounded-md p-2 focus:outline-none text-text-gray"
                    />
                    <span 
                      onClick={() => {setCantFindCategory(false); setFormData({...formData, category: ''})}
                      }
                      className="text-brand-blue cursor-pointer text-sm font-semibold"
                    >
                      Select from existing categories
                    </span>
                  </div>
                ):(
                  <div className='flex flex-col gap-1 items-left'>
                    <select
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      value={formData.category}
                      className="border border-gray-border rounded-md p-2 focus:outline-none text-text-gray"
                    >
                      <option value={''}>Select Material Category</option>
                      {allCategories &&
                        allCategories?.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                      ))}
                    </select>
                    <span 
                      onClick={() => {setCantFindCategory(true); setFormData({...formData, category: ''})}
                      }
                      className="text-brand-blue cursor-pointer text-sm font-semibold"
                    >
                      Can&apos;t find category?
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {error && <ErrorInterface error={error} />}

          <div className='flex items-center justify-center bg-gray-shadow9 w-full p-3 rounded-md'>
            <div className='flex flex-col items-center justify-center gap-2 w-full'>
              <h2 className='text-text-black text-md text-center'>
                select component materials for your new grouped material. After you have finished, click submit on the summary panel on the right to create the new material. 
              </h2>
              <div className='flex flex-row gap-3 items-center'>
                <div>
                  <label className='text-text-black text-sm'>Add component Materials</label>
                  <select 
                    onChange={(e) => setNewComponentMaterial(e.target.value)}
                    value={newComponentMaterial}
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
                    value={newComponentQuantity}
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
        </div>
      </div>
    </form> 
  )
}

export default CreateGroupedMaterialForm;