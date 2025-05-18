import React from 'react';
import { PageAccessRequirement } from '../../PageAccessRequirement';
import AdminSideBar from '../AdminSideBar';
import ViewUserDetails from './components/ViewUserDetails';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserById } from '@/services/usersServices';


const UserDetailsPage = () => {

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
  'The User Details page provides an in-depth view of a specific user within your system. Here, you can review detailed information about the user, including their name, role, contact information, and associated metadata. This interface allows you to manage user-specific actions such as editing their details, resetting their password, or deactivating their account. Use this page to gain a comprehensive understanding of the selected user and perform necessary administrative tasks efficiently.';

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
    <div className='max-h-screen w-full overflow-y-auto no-scrollbar'>
      {id?
        <div className="flex flex-row gap-0 bg-background-1 w-full h-full">
          <div>
              <AdminSideBar 
                selectedMenu={selectedMenu} 
                setSelectedMenu={setSelectedMenu}
              />
          </div>
          <div className='max-h-screen w-full overflow-y-auto no-scrollbar'>
            <ViewUserDetails
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

export default UserDetailsPage;