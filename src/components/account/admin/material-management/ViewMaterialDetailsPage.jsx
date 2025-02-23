import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import ViewMaterialDetails from './components/ViewMaterialDetails';


const ViewMaterialDetailsPage = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [materialData, setMaterialData] = React.useState({});

    React.useEffect(() => {
        // Fetch material data by id
        if (id) {
            setMaterialData({id:id});
        }
    }, [id]);

    React.useEffect(() => {
        if (!id || materialData.error) {
            router.push('/pages/account/admin/manage-materials/view-materials');
        }
    }, []);

  return (
    <div>
        {id? <ViewMaterialDetails materialData={materialData} /> : null}
    </div>
  )
}

export default ViewMaterialDetailsPage;