import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import Image from 'next/image';
import React from 'react'

const ReviewGroupedMaterial = ({formData, loading, setShowReview, handleCreateGroupedMaterial, handleDeleteMaterial, allMaterials, error, setError}) => {

  return (
      <div className='bg-white w-[80%] p-5 rounded-md m-5 flex flex-col gap-5 text-text-gray'>
        <h2 className='font-semibold text-md text-text-black'>Review and confirm material details</h2>
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
        <div className='flex flex-col gap-1 bg-background-1 rounded-md p-2'>
          <h3 className='text-sm'>Component Materials</h3>
          <table className='w-full bg-background-1 rounded-md max-h-72 overflow-y-auto scrollbar-thin text-text-black'>
            <thead>
              <tr className='text-sm px-2 bg-brand-gray w-full'>
                <th className='text-left'>Material</th>
                <th className='text-left'>Quantity</th>
                <th className='text-left'>Unit</th>
                <th className='text-left w-[40%]'>Description</th>
                <th className='text-left'>{` `}</th>
              </tr>
            </thead>
            <tbody>
              {formData?.components?.map((material, index) => {
                const matchMaterial = allMaterials.find((m) => m._id === material.id);
                const matchUnit = matchMaterial && matchMaterial?.unitOfMeasurement?.name;
                const matchDescription = matchMaterial && matchMaterial?.description;

                return (
                  <tr key={index} className='text-sm px-2 border-y border-brand-gray'>
                    <td className=''>{matchMaterial?.name}</td>
                    <td>
                      {material.quantity}
                    </td>
                    <td>
                      {matchUnit}
                    </td>
                    <td className='w-[40%] overflow-y-auto scrollbar-thin'>
                      {matchDescription}
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

        {error && <ErrorInterface error={error}/>}

        <div className='flex flex-row justify-center gap-20'>
          <Button
            onClick={() => {setShowReview(false); setError(null)}}
            text='Back'
            buttonStyle='bg-error text-white'
          />
          <Button 
            onClick={handleCreateGroupedMaterial}
            text='Create'
            buttonStyle='bg-brand-blue text-white'
            loading={loading}
            loadingText={'Creating...'}
            disabled={loading}
          />
        </div>
    </div>
  );
}

export default ReviewGroupedMaterial;