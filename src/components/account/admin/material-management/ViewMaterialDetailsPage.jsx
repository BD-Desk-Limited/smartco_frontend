import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import AdminSideBar from '../AdminSideBar';
import ViewMaterialDetails from './components/ViewMaterialDetails';
import { getMaterialById } from '@/services/materialServices';
import { PageAccessRequirement } from '../../PageAccessRequirement';


const ViewMaterialDetailsPage = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [materialData, setMaterialData] = React.useState({});

    const [selectedMenu, setSelectedMenu] = React.useState({
        name: 'Materials Management',
        icon: '/assets/material.png',
        iconActive: '/assets/material_active.png',
        link: '/manage-materials',
        title: 'Manage Materials',
    });

    const pageDescription =
    'The View Material Details page allows you to see the details of existing materials in your store(s). You can view material information, stock levels, and batches history. This ensures that your material data remains accurate and up-to-date, facilitating better inventory management and product creation. Additionally, you can view an image of the material to provide a visual reference, making it easier to identify and manage materials within your inventory.';

    React.useEffect(() => {
            // Fetch material data by id
            if (id) {
                const fetchMaterialData = async () => {
                    const response = await getMaterialById(id);
                    if (response.data) {
                        setMaterialData(response.data);
                    } 
                    if (response.error) {
                        console.error('Error fetching material data:', response.error);
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

  const accessCheckFailed = PageAccessRequirement(
      'admin',
      'Materials_Management',
  );  

  if (accessCheckFailed) {
    return accessCheckFailed;
  };

  return (
  <div>
    {id?
        <div className="flex flex-row gap-0 bg-background-1">
            <div>
                <AdminSideBar 
                    selectedMenu={selectedMenu} 
                    setSelectedMenu={setSelectedMenu}
                />
            </div>
            <div className='w-full'>
                <ViewMaterialDetails 
                    materialData={materialData} 
                    pageDescription={pageDescription}
                /> 
            </div>
        </div>:
        null
    }
  </div>
  );
}

export default ViewMaterialDetailsPage;