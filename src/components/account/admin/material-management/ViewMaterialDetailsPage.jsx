'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminSideBar from '../AdminSideBar';
import ViewMaterialDetails from './components/ViewMaterialDetails';
import { getMaterialDetailsAndStockById } from '@/services/materialServices';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import Spinner from '../../Spinner';
import { getUserBranchesService } from '@/services/branchServices';

const ViewMaterialDetailsPage = () => {
  const [selectedMenu, setSelectedMenu] = React.useState(
    'materials-management'
  );

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const [loadingBranches, setLoadingBranches] = React.useState(true);
  const [loadingMaterial, setLoadingMaterial] = React.useState(true);
  const [materialData, setMaterialData] = React.useState({});
  const [allUserBranches, setAllUserBranches] = React.useState([]);
  const [requestedBranches, setRequestedBranches] = React.useState([]);

  const pageDescription =
    'The View Material Details page allows you to see the details of existing materials in your store(s). You can view material information, stock levels, and batches history. This ensures that your material data remains accurate and up-to-date, facilitating better inventory management and product creation. Additionally, you can view an image of the material to provide a visual reference, making it easier to identify and manage materials within your inventory.';

  // Fetch the user's accessible branches once — independent of which material is being viewed
  React.useEffect(() => {
    const fetchUserBranches = async () => {
      setLoadingBranches(true);
      try {
        const response = await getUserBranchesService();
        if (response.data) {
          setAllUserBranches(response.data);
        }
        if (response.error) {
          console.error('Error fetching user branch data:', response.error);
        }
      } catch (error) {
        console.error(
          'error loading user branch, please try again later:',
          error
        );
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchUserBranches();
  }, []);

  // Fetch material + stock data, refetches whenever the branch filter changes
  React.useEffect(() => {
    if (!id) return;

    const fetchMaterialData = async () => {
      setLoadingMaterial(true);
      try {
        const response = await getMaterialDetailsAndStockById(
          id,
          requestedBranches
        );
        if (response.data) {
          setMaterialData(response.data);
        }
        if (response.error) {
          console.error('Error fetching material data:', response.error);
          router.push('/pages/account/admin/manage-materials/view-materials');
        }
      } catch (error) {
        console.error(
          'error loading material stock data, please try again later:',
          error
        );
      } finally {
        setLoadingMaterial(false);
      }
    };
    fetchMaterialData();
  }, [id, router, requestedBranches]);

  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/manage-materials/view-materials');
    }
  }, [id, router]);

  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Materials_Management'
  );

  if (accessCheckFailed) {
    return accessCheckFailed;
  }

  const loading = loadingBranches || loadingMaterial;

  return loading ? (
    <Spinner />
  ) : (
    <div>
      {id ? (
        <div className="flex flex-row gap-0 bg-background-1">
          <div>
            <AdminSideBar
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          </div>
          <div className="w-full">
            <ViewMaterialDetails
              materialData={materialData}
              allUserBranches={allUserBranches}
              requestedBranches={requestedBranches}
              setRequestedBranches={setRequestedBranches}
              pageDescription={pageDescription}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ViewMaterialDetailsPage;
