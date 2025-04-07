import { getMaterialComponentsBreakdown } from '@/services/materialServices';
import React from 'react'

const GroupedMaterialBreakdown = ({id}) => {

    const [groupedMaterialBreakdown, setGroupedMaterialBreakdown] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchGroupedMaterialBreakdown = async () => {
            try{
                setLoading(true);
                const response = await getMaterialComponentsBreakdown(id);
                if(response.data) {
                    setGroupedMaterialBreakdown(response.data);
                }
            }catch (error) {
                console.error('Error fetching grouped material breakdown:', error);
            }finally {
                setLoading(false);
            }
        };
        fetchGroupedMaterialBreakdown();
    }, [id]);

    //get materials that appears twice, and sum up their quantities
    const aggregatedBreakdown = groupedMaterialBreakdown.reduce((acc, material) => {
      const existingMaterial = acc.find(item => item.name === material.name);
      if (existingMaterial) {
        existingMaterial.quantity += material.quantity;
      } else {
        acc.push({ ...material });
      }
      return acc;
    }, []);
     
    return (
    <div className='w-[40%] text-left'>
      <h1 className='font-semibold'>Components breakdown</h1>
      <table className="w-full">
      <thead className='bg-brand-gray text-white text-sm'>
        <tr className='text-left flex justify-between px-5'>
        <th className='p-1'>Material</th>
        <th className='p-1'>Quantity</th>
        </tr>
      </thead>
      </table>
      <div className="max-h-40 overflow-y-auto scrollbar-thin shadow-md">
        <table className="w-full">
          <tbody className='text-sm'>
            {loading ? (
              <tr>
                <td colSpan={2} className='text-center'>Loading...</td>
              </tr>
            ) : (
              aggregatedBreakdown.map((material) => (
                <tr key={material._id} className='border-t border-brand-gray flex  justify-between px-5'>
                  <td className='px-2'>{material.name}</td>
                  <td className='px-2'>{material.quantity} {material?.unitOfMeasurement?.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GroupedMaterialBreakdown;