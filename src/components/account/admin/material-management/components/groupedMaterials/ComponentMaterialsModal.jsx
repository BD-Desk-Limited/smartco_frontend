import Image from 'next/image';
import React from 'react';
import {useRouter} from 'next/navigation';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const ComponentMaterialsModal = ({material, onClose, allMaterials}) => {
    const Router = useRouter();
    
    const getComponentById = (id) => {
        return allMaterials.find((material) => material._id === id)
    };

  return (
    <div className='w-full h-full md:h-auto md:w-[60%] lg:w-[35%] p-2 md:p-4 flex flex-col items-center justify-between gap-1'>
        <button
          onClick={onClose}
          title="Close"
          className="bg-brand-gray text-white w-fit px-4 py-2 rounded-full hover:bg-gray-shadow2"
        >
          X
        </button>
        <div className='flex flex-col gap-3 bg-background-1 rounded-lg p-3 w-full flex-1 md:flex-none md:h-[80vh] overflow-y-auto'>
            <h1 className='font-bold'>Grouped Material Summary</h1>
            <h1 className='text-lg font-semibold text-brand-blue'>{material.name}</h1>
            <span className='text-sm max-h-40 overflow-y-auto scrollbar-thin'>{material.description}</span>

            <div className='flex flex-col rounded-lg p-2'>
                <h2 className=''>Component materials</h2>
                    {material.components && material.components.length > 0 ? (
                        <ResponsiveTable
                            align="left"
                            dense
                            maxHeightClass="md:max-h-[50vh]"
                            getRowKey={(_, i) => i}
                            rows={material.components
                                .map((component) => ({ component, material: getComponentById(component.id) }))
                                .filter((r) => r.material)}
                            columns={[
                                { key: 'material', header: 'Material', cell: (r) => r.material.name, mobile: 'title' },
                                {
                                    key: 'qty',
                                    header: 'Quantity',
                                    cell: (r) => `${r.component.quantity} ${r.material?.unitOfMeasurement?.name || ''}`,
                                    mobile: 'badge',
                                },
                            ]}
                        />
                    ):(
                        <div className='flex items-center justify-center h-20'>
                            <span className='text-sm text-gray-400'>This materials has no component</span>
                        </div>
                    )}
            </div>
            <div className='flex items-center justify-center w-full'>
                <button
                    onClick={()=>Router.push(`/pages/account/admin/manage-materials/edit-grouped-material?id=${material._id}`)}
                    className="bg-brand-blue text-white px-4 rounded-md hover:bg-opacity-[90%] py-2 w-fit flex items-center justify-center"
                    title="Edit"
                >
                    <Image 
                        src="/assets/edit.png"
                        alt="Edit"
                        width={20}
                        height={20}
                        className="mr-2"
                    />
                    Edit
                </button>
            </div>
            
        </div>
    </div>
  )
}

export default ComponentMaterialsModal;