import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import AdminSideBar from '../AdminSideBar';
import EditMaterial from './components/EditMaterial';
import { getMaterialById } from '@/services/materialServices';


const EditMaterialPage = () => {

    const [selectedMenu, setSelectedMenu] = React.useState({
        name: 'Materials Management',
        icon: '/assets/material.png',
        iconActive: '/assets/material_active.png',
        link: '/manage-materials',
        title: 'Manage Materials',
      });

    const pageDescription =
    'The Edit Material page allows you to modify the details of existing materials in your store(s). You can update material information, change categories and units, and save the changes. This ensures that your material data remains accurate and up-to-date, facilitating better inventory management and product creation. Additionally, you can upload an image of the material to provide a visual reference, making it easier to identify and manage materials within your inventory.';

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [materialData, setMaterialData] = React.useState({});

    React.useEffect(() => {
        // Fetch material data by id
        if (id) {
            const fetchMaterialData = async () => {
                const response = await getMaterialById(id);
                if (response.data) {
                    setMaterialData(response.data);
                } else {
                    router.push('/pages/account/admin/manage-materials/view-materials');
                };
            }
            fetchMaterialData();
        };
    }, [id, router]);

    React.useEffect(() => {
        if (!id) {
            router.push('/pages/account/admin/manage-materials/view-materials');
        };
    }, [id, router]);

  return (
  <>
    {id?
        <div className="flex flex-row gap-0 bg-background-1">
            <div>
                <AdminSideBar 
                    selectedMenu={selectedMenu} 
                    setSelectedMenu={setSelectedMenu}
                />
            </div>
            <div className='w-full'>
                <EditMaterial 
                    materialData={materialData} 
                    pageDescription={pageDescription}
                /> 
            </div>
        </div>
        :
        null
    }
  </>)
}

export default EditMaterialPage;