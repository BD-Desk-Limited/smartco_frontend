import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import Image from 'next/image';
import React from 'react'

const EditGroupedMaterialComponentDisplay = ({
    updatedMaterialData = {}, 
    materialData,
    setUpdatedMaterialData, 
    allMaterials = [],
    setShowReview,
    handleDeleteMaterial,
    newMaterialImage,
}) => {

    const [previewError, setPreviewError] = React.useState(false);

    const handleSave = () => {
        setPreviewError(null);
        if(!updatedMaterialData?.name || !updatedMaterialData?.description || !updatedMaterialData?.category?.name || !updatedMaterialData?.unitOfMeasurement?.name) {
          setPreviewError(`please fill in all fields: ${
            !updatedMaterialData?.name ? 'name' :
            !updatedMaterialData?.description ? 'description' :  
            !updatedMaterialData?.category.name ? 'category' :
            !updatedMaterialData?.unit.name ? 'unit' : ''
          } is not filled`);
          return;
        };

        setShowReview(true);
    };

  return (
    <div className='bg-white w-[35%] p-5 rounded-md m-5 flex flex-col gap-5 text-text-gray border border-brand-gray'>
      <h2 className='font-semibold text-md'>Grouped Material Summary</h2>
      <div className='flex flex-col gap-1 text-sm'>
        <p className='font-bold text-md'><span>{updatedMaterialData?.name}</span></p>
        <p><span>Category: </span><span className='font-semibold'>{updatedMaterialData?.category?.name}</span></p>
        <p><span>Unit of measurement: </span><span className='font-semibold'>{updatedMaterialData?.unitOfMeasurement?.name}</span></p>
        <p><span>Material Type: </span><span className='font-semibold'>{updatedMaterialData?.materialType}</span></p>
        <p className='max-h-28 max-w-[100%] overflow-y-auto scrollbar-thin p-2 italic'>
          <span className=''>
            {updatedMaterialData?.description}
          </span>
        </p>
      </div>
      <div className='flex flex-col gap-1'>
        <h3 className='text-sm'>Component Materials</h3>
        <table className='w-full bg-background-1 rounded-md max-h-72 overflow-y-auto scrollbar-thin text-text-black'>
          <thead>
            <tr>
              <th className='text-left'>Material</th>
              <th className='text-left'>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {updatedMaterialData?.components&&
            updatedMaterialData?.components?.map((material, index) => {
              const matchMaterial = allMaterials && allMaterials.find((m) => m._id === material.id);
              const matchUnit = matchMaterial && matchMaterial?.unitOfMeasurement?.name;
              
              return (
                <tr key={index} className='text-sm px-2 border-y border-brand-gray'>
                  <td className=''>{matchMaterial?.name || 'deleted or unknown material'}</td>
                  <td>
                    {material.quantity}{` `}{matchUnit}
                  </td>
                  <td>
                    <Image
                      onClick={() => handleDeleteMaterial(material.id)}
                      src={'/assets/delete.png'}
                      width={20}
                      height={20}
                      alt='Delete material'
                      title='Delete material'
                      className='cursor-pointer hover:opacity-70'
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {previewError && (
        <ErrorInterface error={previewError}/>
      )}

      
      <div className='flex flex-row justify-center gap-2'>
        {(updatedMaterialData?.components?.length > 1) &&  (updatedMaterialData !== materialData || newMaterialImage) &&(
            <Button
              onClick={handleSave}
              text={'Save Changes'}
              buttonStyle={'bg-brand-blue text-white px-3 py-1 rounded-md'}
            />
        )}
        {(updatedMaterialData !== materialData) && (
            <Button
              onClick={() => setUpdatedMaterialData(materialData)}
              text={'Reset'}
              buttonStyle={'bg-red-500 text-white px-3 py-1 rounded-md'}
            />
        )}
      </div>
        
    </div>
  )
}

export default EditGroupedMaterialComponentDisplay;