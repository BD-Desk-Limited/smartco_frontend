'use client';
import React from 'react'
import AdminSideBar from '../AdminSideBar';
import EditBranch from './components/EditBranch';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBranchById } from '@/services/branchServices';

const EditBranchPage = () => {

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [branchData, setBranchData] = React.useState({});
  const [selectedMenu, setSelectedMenu] = React.useState({
      name: 'Branch Management',
      icon: '/assets/store.png',
      iconActive: '/assets/branch.png',
      link: '/branch-management',
      title: 'Branch Management',
  });

  const pageDescription =
  'The Edit Branch page allows you to update the details of an existing branch within your company. You can modify branch information such as its name, location, and associated metadata. This interface ensures that branch details remain accurate and up-to-date. Use the provided form to make changes and save updates. Additionally, you can review the current branch details before making any modifications.';

  React.useEffect(() => {
    // Fetch material data by id
    if (id) {
      const fetchBranchData = async () => {
        const response = await getBranchById(id);
        if (response.data) {
            setBranchData(response.data);
        } else {
          router.push('/pages/account/admin/branch-management');
        };
      }
      fetchBranchData();
    };
  }, [id, router]);

  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/branch-management');
    };
  }, [id, router]);

  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Branch_Management',
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
                  <EditBranch
                    branchData={branchData}
                    setBranchData={setBranchData}
                    pageDescription={pageDescription}
                  /> 
              </div>
          </div>:
          null
      }
    </div>
  );
};

export default EditBranchPage;