import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserById } from '@/services/usersServices';
import EditUserDetails from './components/EditUserDetails/EditUserDetails';


const EditUserDetailsPage = () => {

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [userData, setUserData] = React.useState({});
  const [selectedMenu, setSelectedMenu] = React.useState({
    name: 'Users Management',
    icon: '/assets/user.png',
    iconActive: '/assets/user_active.png',
    link: '/users-management',
    title: 'Users Management',
  });

const pageDescription =
    'The Update User Details page allows administrators to modify the information of a specific user within the system. Here, you can update user details such as their name, role, contact information, and other associated metadata. This interface is designed to streamline administrative tasks, ensuring that user information remains accurate and up-to-date.';

  // Fetch user data based on the id from the URL
  React.useEffect(() => {
    // Fetch user data by id
    if (id) {
      const fetchUserData = async () => {
        const response = await getUserById(id);
        if (response.data) {
          setUserData(response.data);
        }
        if (response.error) {
          console.error('Error fetching user data:', response.error);
          router.push('/pages/account/admin/users-management/');
        }
      }
      fetchUserData();
    };
  }, [id, router]);

  // Redirect to the users management page if no id is provided
  React.useEffect(() => {
    if (!id) {
      router.push('/pages/account/admin/users-management/');
    };
  }, [id, router]);

  // Check if the user has access to this page
  const accessCheckFailed = PageAccessRequirement(
    'admin',
    'Users_Management',
  );  

  if (accessCheckFailed) {
    return accessCheckFailed;
  };

  return (
    <div>
      {id?
        <div className="flex flex-row gap-0 bg-background-1 h-full w-full overflow-hidden">
          <div>
              <AdminSideBar 
                selectedMenu={selectedMenu} 
                setSelectedMenu={setSelectedMenu}
              />
          </div>
          <div className='w-full'>
            <EditUserDetails
              userData={userData}
              setUserData={setUserData}
              pageDescription={pageDescription}
            /> 
          </div>
        </div>:
        null
      }
    </div>
  )
}

export default EditUserDetailsPage;