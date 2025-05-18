import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getGroupedMaterialById } from '@/services/materialServices';
import EditGroupedMaterial from './components/groupedMaterials/EditGroupedMaterial';
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';

const EditGroupedMaterialPage = () => {

  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Materials Management',
    icon: '/assets/material.png',
    iconActive: '/assets/material_active.png',
    link: '/manage-materials',
    title: 'Manage Materials',
  });

  const pageDescription =
  'The Edit Grouped Material page allows you to modify the details of grouped materials in your store(s). Grouped materials are collections of individual materials that are managed together. You can update grouped material information, change categories and units, and save the changes. These materials will not be available for sales over the counter, ensuring they are used exclusively for specific purposes or internal processes. Additionally, you can upload an image of the grouped material to provide a visual reference, making it easier to identify and manage within your inventory.';

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [materialData, setMaterialData] = React.useState({});

  React.useEffect(() => {
    // Fetch material data by id
    if (id) {
        const fetchGroupedMaterialData = async () => {
          const response = await getGroupedMaterialById(id);
          if (response.data) {
              setMaterialData(response.data);
          } else {
              router.push('/pages/account/admin/manage-materials/view-grouped-materials');
          };
        }
        fetchGroupedMaterialData();
    };
  }, [id, router]);

  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/manage-materials/view-grouped-materials');
    };
  }, [id, router]);

  const accessCheckFailed = PageAccessRequirement(
      'admin',
      'Materials_Management',
  );  

  if (accessCheckFailed) {
    return accessCheckFailed;
  };

  return (
    <>
      {id?
        <div className="flex flex-row gap-0 bg-background-1 w-full h-full">
            <div>
                <AdminSideBar
                    selectedMenu={selectedMenu} 
                    setSelectedMenu={setSelectedMenu}
                />
            </div>
            <div className='w-full max-h-[100vh] overflow-y-auto no-scrollbar'>
                <EditGroupedMaterial
                  materialData={materialData} 
                  pageDescription={pageDescription}
                /> 
            </div>
        </div>
        :
        null
      }
    </>
  )
}

export default EditGroupedMaterialPage;