import Image from 'next/image';
import React from 'react';
import {useRouter} from 'next/navigation';

const ComponentMaterialsModal = ({material, onClose, allMaterials}) => {
    const Router = useRouter();
    
    const getComponentById = (id) => {
        return allMaterials.find((material) => material._id === id)
    };

  return (
    <div className='w-[35%] p-4 flex flex-col items-center justify-between gap-1'>
        <button
          onClick={onClose}
          title="Close"
          className="bg-brand-gray text-white w-fit px-4 py-2 rounded-full hover:bg-gray-shadow2"
        >
          X
        </button>
        <div className='flex flex-col gap-3 bg-background-1 rounded-lg p-3 w-full h-[80vh] overflow-y-auto scrollbar-thin'>
            <h1 className='font-bold'>Grouped Material Summary</h1>
            <h1 className='text-lg font-semibold text-brand-blue'>{material.name}</h1>
            <span className='text-sm max-h-40 overflow-y-auto scrollbar-thin'>{material.description}</span>

            <div className='flex flex-col rounded-lg p-2'>
                <h2 className=''>Component materials</h2>
                    {material.components && material.components.length > 0 ? (
                        <table className='w-full rounded-lg'>
                            <thead className='text-left text-md bg-gray-shadow5 '>
                                <tr className='text-sm'> 
                                    <th className='p-1 font-semibold'>Material</th>
                                    <th className='p-1 font-semibold'>Quantity</th>
                                </tr>
                            </thead>
                            <tbody className='text-sm max-h-[50vh] overflow-y-auto scrollbar-thin'>
                                {material.components.map((component, index) => {
                                    const componentMaterial = getComponentById(component.id);
                                    if (!componentMaterial) return null; // Skip if material not found
                                    return(
                                        <tr key={index} className='text-sm'>
                                            <td className='p-1'>{componentMaterial.name}</td>
                                            <td className='p-1'>{component.quantity} {componentMaterial?.unitOfMeasurement?.name}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
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