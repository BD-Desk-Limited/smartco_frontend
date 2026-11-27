import Button from '@/components/account/Button';
import ErrorInterface from '@/components/account/errorInterface';
import Image from 'next/image';
import React from 'react'
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const ReviewGroupedMaterial = ({formData, loading, setShowReview, handleCreateGroupedMaterial, handleDeleteMaterial, allMaterials, error, setError}) => {

  return (
      <div className='bg-white w-full lg:w-[80%] p-3 md:p-5 rounded-md md:m-5 flex flex-col gap-5 text-text-gray'>
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
          <ResponsiveTable
            align="left"
            dense
            maxHeightClass="md:max-h-72"
            getRowKey={(_, i) => i}
            rows={formData?.components || []}
            columns={[
              {
                key: 'material',
                header: 'Material',
                mobile: 'title',
                cell: (m) => allMaterials.find((x) => x._id === m.id)?.name,
              },
              { key: 'qty', header: 'Quantity', cell: (m) => m.quantity },
              {
                key: 'unit',
                header: 'Unit',
                cell: (m) => allMaterials.find((x) => x._id === m.id)?.unitOfMeasurement?.name,
              },
              {
                key: 'description',
                header: 'Description',
                mobile: 'wide',
                cell: (m) => allMaterials.find((x) => x._id === m.id)?.description,
              },
            ]}
            actions={(m) => (
              <button
                type="button"
                onClick={() => handleDeleteMaterial(m.id)}
                title="Delete material"
                aria-label="Delete material"
                className="hover:opacity-70"
              >
                <Image src={'/assets/delete.png'} width={20} height={20} alt="" />
              </button>
            )}
            actionsHeader=""
          />
        </div>

        {error && <ErrorInterface error={error}/>}

        <div className='flex flex-row flex-wrap justify-center gap-4 md:gap-20'>
          <Button
            onClick={() => {setShowReview(false); setError(null)}}
            text='Back'
            buttonStyle='bg-error text-white'
          />
          <Button 
            onClick={handleCreateGroupedMaterial}
            text='Save'
            buttonStyle='bg-brand-blue text-white'
            loading={loading}
            loadingText={'Saving...'}
            disabled={loading}
          />
        </div>
    </div>
  );
}

export default ReviewGroupedMaterial;