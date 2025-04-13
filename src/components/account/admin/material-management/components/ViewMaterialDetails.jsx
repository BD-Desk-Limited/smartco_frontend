import PageDescription from '@/components/account/PageDescription';
import React from 'react';
import {useRouter} from 'next/navigation';
import Header from '@/components/account/Header';
import MaterialSidebar from './materialSidebar';
import SubHeader from '../../../SubHeader';
import Image from 'next/image';
import Button from '@/components/account/Button';
import GroupedMaterialBreakdown from './groupedMaterials/GroupedMaterialBreakdown';

const ViewMaterialDetails = ({materialData, pageDescription}) => {

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const Router = useRouter();

  const selectedSubMenu = {
    name: 'View All Materials',
    link: '/view-materials',
  };

  const batchesWithStock = materialData.batches?.filter(batch => batch.quantity > 0);
  const totalStock = batchesWithStock?.reduce((acc, batch) => acc + batch.quantity, 0);
  console.log('materialData', materialData);
  return (
    <div className='w-full h-full max-h-screen overflow-hidden'>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div>
        <SubHeader title={'View Material details'} />
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
          <div className="bg-white p-5 mx-5 my-2 rounded-md max-h-[90vh] overflow-y-auto scrollbar-thin text-text-gray flex flex-row gap-20 px-10 py-5">
            <div className='flex flex-col justify-center items-center'>
              <Image 
                src={materialData.imageURL || '/assets/edit-material.png'}
                alt={materialData.name || 'Material Image'}
                width={200}
                height={200}
                className='rounded-[100%] h-[250px] w-[350px]'
              />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <h1 className='font-bold text-xl'>{materialData.name}</h1>
              <div className='flex flex-row justify-between gap-2'>
                <div className='w-[50%] flex flex-col gap-2'>
                  <p className='h-28 overflow-y-auto scrollbar-thin'>{materialData.description}</p>
                  <p>Material Type: {materialData.materialType}</p>
                  <p>Material Category: {materialData.category?.name}</p>
                  <p>Unit: {materialData.unitOfMeasurement?.name}</p>
                </div>
    
                {
                  materialData.isGroup && 
                    <GroupedMaterialBreakdown 
                      id={materialData._id}
                    /> 
                }
              </div>
              <div>
                <span className=''>Stock Level:</span>
                <span className=''>
                  {batchesWithStock?.length>0?
                  <div className='overflow-y-auto scrollbar-thin max-h-40'>
                  <table className='w-full border-collapse rounded-md'>
                    <thead className=' sticky top-0'>
                      <tr className='w-full px-5 py-0.5 rounded-t-lg flex flex-row justify-between gap-5 bg-brand-blue text-white border-b-2 border-b-text-white'>
                        <th>Batch ID</th>
                        <th>Quantity</th>
                        <th>Supply Date</th>
                        <th>Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchesWithStock?.map((stockLevel) => (
                        <tr key={stockLevel._id} className='w-full flex flex-row justify-between gap-5 border-b-2 border-b-text-white bg-blue-shadow10 text-sm px-5 py-1'>
                          <td>{stockLevel.batch_number}</td>
                          <td>{stockLevel.quantity}</td>
                          <td>{new Date(stockLevel.createdAt).toLocaleDateString()}</td>
                          <td>{stockLevel.expiryDate ? new Date(stockLevel.expiryDate).toLocaleDateString() : 'Not specified'}</td>
                        </tr>
                      ))}
                      <tr className='w-full px-5 py-0.5 rounded-b-lg flex flex-row justify-between gap-5 bg-brand-blue text-white'>
                        <td>Total</td>
                        <td>{totalStock}</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>:
                  <span className='p-10 font-semibold text-error'>No stock available</span>}
                </span>
              </div>
              
              <div className='flex flex-row gap-10 py-10'>
                <Button 
                  text={'Edit Material'}
                  onClick={materialData.isGroup? 
                    ()=>Router.push(`/pages/account/admin/manage-materials/edit-grouped-material?id=${materialData._id}`):
                    ()=>Router.push(`/pages/account/admin/manage-materials/edit-material?id=${materialData._id}`)
                  }
                />
                <Button 
                  text={'Exit'}
                  onClick={materialData.isGroup?
                    ()=>Router.push('/pages/account/admin/manage-materials/view-grouped-materials'):
                    ()=>Router.push('/pages/account/admin/manage-materials/view-materials')
                  }
                  buttonStyle={'bg-brand-gray px-5'}
                />
              </div>
            </div>
          </div>
          <PageDescription pageDescription={pageDescription} />
          </div>
        </div>
      </div>
  )
}

export default ViewMaterialDetails;