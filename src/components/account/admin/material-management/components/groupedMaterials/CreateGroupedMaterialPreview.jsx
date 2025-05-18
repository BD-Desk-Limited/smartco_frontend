import React from 'react';
import Image from 'next/image';
import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';

const CreateGroupedMaterialsPreview = ({formData, setFormData, allMaterials, setShowReview, handleDeleteMaterial}) => {

  const [previewError, setPreviewError] = React.useState(null);

  const handleSave = () => {
    setPreviewError(null);
    if(!formData?.name || !formData?.description || !formData?.category || !formData?.unit) {
      setPreviewError(`please fill in all fields: ${
        !formData?.name ? 'name' :
        !formData?.description ? 'description' :  
        !formData?.category ? 'category' :
        !formData?.unit ? 'unit' : ''
      } is not filled`);
      return;
    };

    if(formData?.components?.length < 2) {
      setPreviewError('Please select at least two component materials to create a grouped material');
      return;
    };
    setShowReview(true);
  };


  return (
    <div className='bg-white w-[40%] p-5 rounded-md m-5 flex flex-col gap-5 text-text-gray border border-brand-gray'>
      <h2 className='font-semibold text-md'>Grouped Material Summary</h2>
      <div className='flex flex-col gap-1 text-sm'>
        <p className='font-bold text-md'><span>{formData?.name}</span></p>
        <p><span>Category: </span><span className='font-semibold'>{formData?.category}</span></p>
        <p><span>Unit of measurement: </span><span className='font-semibold'>{formData?.unit}</span></p>
        <p><span>Material Type: </span><span className='font-semibold'>{formData?.materialType}</span></p>
        <p className='max-h-28 max-w-[100%] overflow-y-auto scrollbar-thin p-2 italic'>
          <span className=''>
            {formData?.description}
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
            {formData?.components?.map((material, index) => {
              const matchMaterial = allMaterials.find((m) => m._id === material.id);
              const matchUnit = matchMaterial && matchMaterial?.unitOfMeasurement?.name;
              return (
                <tr key={index} className='text-sm px-2 border-y border-brand-gray'>
                  <td className=''>{matchMaterial?.name}</td>
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

      {
        formData?.components?.length > 1 && (
          <div className='flex flex-row justify-center gap-2'>
            <Button
              onClick={handleSave}
              text={'Submit'}
              buttonStyle={'bg-brand-blue text-white px-3 py-1 rounded-md'}
            />
            <Button
              onClick={() => setFormData({...formData, components: []})}
              text={'Clear'}
              buttonStyle={'bg-red-500 text-white px-3 py-1 rounded-md'}
            />
          </div>
        )
      }
    </div>
  )
}

export default CreateGroupedMaterialsPreview;