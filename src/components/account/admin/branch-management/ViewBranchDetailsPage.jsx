'use client';
import React from 'react'
import AdminSideBar from '../AdminSideBar';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import ViewBranchDetails from './components/ViewBranchDetails';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBranchById } from '@/services/branchServices';


const ViewBranchDetailsPage = () => {

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
      'The Branch Details page provides an overview of a specific branch within your company. Here, you can view detailed information about the branch, including its name, location, and contact details. Additionally, you can see a list of users associated with this branch, along with their roles and contact information. This interface allows you to efficiently manage branch details and the users assigned to it.';

  React.useEffect(() => {
    // Fetch material data by id
    if (id) {
        const fetchBranchData = async () => {
          const response = await getBranchById(id);
          if (response.data) {
              setBranchData(response.data);
          } else {
              router.push('/pages/account/admin/branch-management/view-branch');
          };
        }
        fetchBranchData();
    };
  }, [id, router]);

  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/branch-management/view-branch');
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
                  <ViewBranchDetails
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

export default ViewBranchDetailsPage;