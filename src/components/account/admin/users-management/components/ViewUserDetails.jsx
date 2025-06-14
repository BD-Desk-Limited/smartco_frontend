import React from 'react';
import {useRouter} from 'next/navigation';
import UsersManagementSidebar from './UsersManagementSidebar';
import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import PageDescription from '@/components/account/PageDescription';
import Button from '@/components/account/Button';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';


const ViewUserDetails = ({pageDescription, userData}) => {
    
  const selectedSubMenu = {
    name: 'View All Users',
    link: '/',
  };
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const Router = useRouter();
  const {user} = useAuth();
  const isSuperAdmin = user?.superAdmin;

  const accessLevels = userData?.accessLevel && userData.accessLevel.map(
    (access) => ({
      accessName: access.accessName.split("_")[0] + ' ' + access.accessName.split("_")[1],
      accessGranted: access.accessGranted,
      allowedGrantOthers: access.allowedGrantOthers,
      lastModified: new Date(access.lastModified),
      grantedBy: access.grantedBy?.fullName,
      modifiedBy: access.modifiedBy?.fullName
    })
  ) || [];

  return (
    <div className='max-h-screen no-scrollbar'>
      <div className="w-full h-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader title={'View User Details'}/>
      </div>
      <div className="flex flex-row gap-0 w-full h-full">
        <div className="min-w-fit">
          <UsersManagementSidebar 
            selectedSubMenu={selectedSubMenu}
            isOpen={openSidebar}
            setIsOpen={setOpenSidebar}
          />
        </div>
        <div className='flex flex-col h-full w-full'>
          <div className="p-5 mx-5 rounded-md h-full w-full flex flex-row gap-5">
            <div className='flex flex-col gap-5 min-h-[60vh] min-w-[27%]'>
              <div className='bg-white shadow-md rounded-lg p-2 relative'>
                <Image
                  src={userData?.profilePictureUrl || '/assets/anonymous.png'}
                  alt={'user'}
                  width={150}
                  height={150}
                  className='rounded-full'
                />
                <ul className='flex flex-col px-5 gap-2 text-text-gray'>
                  <li className='text-lg font-semibold'>{userData?.fullName}</li>
                  <li className=''>{userData?.staffId}</li>
                  <li className=''>{userData?.email}</li>
                  <li className=''>{userData?.phoneNumber}</li>
                  {userData?.team && 
                    <li className=''>
                      <strong>Team/Department:</strong> 
                      {userData?.team?.name}
                    </li>
                  }

                </ul>
                <p className={`absolute top-1 right-1 px-2 shadow-black shadow-sm text-white italic rounded-full ${
                  userData.role=== 'admin'? 'bg-error': 
                  userData?.role === 'manager'? 'bg-brand-blue' : 'bg-brand-gray'
                  }`}
                >
                  {userData?.role}
                </p>
              </div>
              <div className='bg-white shadow-md rounded-lg p-2'>
                <div className='text-text-gray text-sm italic px-5 flex flex-col gap-2'>
                <p>
                  <strong>Account Status: </strong> 
                  {userData?.isActive ? 'Active' : 'Inactive'}
                </p>
                <p>
                  <strong>Last Login: </strong> 
                  {userData?.lastLoggedIn ? new Date(userData?.lastLogin).toLocaleString() : 'N/A'}
                </p>
                <p>
                  <strong>Account Created: </strong> 
                  {userData?.createdAt ? new Date(userData?.createdAt).toLocaleString() : 'N/A'}
                </p>
                <p>
                  <strong>Last updated: </strong>
                  {userData?.updatedAt ? new Date(userData?.updatedAt).toLocaleString() : 'N/A'}
                </p>
                <p>
                  <strong>Last Updated By: </strong> 
                  {userData?.updatedBy?.fullName || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Only super admin can view permissions here, because they belong to all teams. All other admin can view permission of their team members in the my team section */}
          {userData?.role === 'admin'&& isSuperAdmin === true &&
            <div className='w-full min-h-full text-text-gray mr-5 flex flex-col gap-0 rounded-lg'>
              <h3 className='w-fit bg-white p-2 rounded-t-lg border border-inherit font-semibold'>User permissions</h3>
              <div className='bg-white w-full min-h-[90%] max-h-[90%] overflow-y-auto no-scrollbar shadow-lg border rounded-b-lg rounded-tr-lg border-inherit p-2'>
                <h3 className='mb-3'>View access permissions granted to this user</h3>
                {userData?.accessLevel?.length ? (
                  <table className='w-full'>
                    <thead className='border-2 border-y-gray-shadow9 text-sm bg-gray-shadow9  text-text-black'>
                      <tr>
                        <th className='py-1 text-left'>Access Type</th>
                        <th className='py-1 text-left'>Access Granted</th>
                        <th className='py-1 text-left'>Allowed to Grant Others</th>
                        <th className='py-1 text-left'>Granted By</th>
                        <th className='py-1 text-left'>Last Updated</th>
                        <th className='py-1 text-left'>Updated By</th>
                      </tr>
                    </thead>
                    <tbody className='border border-text-gray text-sm'>
                      {accessLevels?.length && accessLevels?.map((access, index) => (
                          <tr key={index} className='hover:bg-background-1 hover:cursor-pointer'>
                            <td className='border border-t-background-1 py-1 px-1'>{access.accessName}</td>
                            <td className='border border-t-background-1 py-1 px-1'>{access.accessGranted ? 'Yes' : 'No'}</td>
                            <td className='border border-t-background-1 py-1 px-1'>{access.allowedGrantOthers ? 'Yes' : 'No'}</td>
                            <td className='border border-t-background-1 py-1 px-1'>{access.grantedBy}</td>
                            <td className='border border-t-background-1 py-1 px-1'>{access.lastModified.toLocaleString()}</td>
                            <td className='border border-t-background-1 py-1 px-1'>{access.modifiedBy}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ):(
                  <div className='flex flex-col gap-2 items-center justify-center py-20 text-error font-semibold'>
                    <span className='text-center'>No access permissions granted to this user</span>
                  </div>
                )}
              </div>
            </div>
          }
          {userData?.role !== 'admin' && 
            <div className='shadow-lg w-full rounded-lg bg-text-white mr-5 p-5'> 
              {userData?.branch?.length > 0 ? (
                  <div className='h-full flex flex-col justify-between'>
                    <h3 className='mb-3 font-semibold text-text-gray'>Branches User is associated with</h3>
                    <ul className='flex flex-col gap-2 h-[90%] overflow-y-auto scrollbar-thin'>
                      {userData?.branch?.map((branch, index) => (
                        <li 
                          key={index} 
                          className='flex flex-row gap-2 items-center border-b border-gray-border p-2 hover:bg-background-1'
                        >
                          <Image
                            src={branch?.branchLogo || '/assets/branch.png'}
                            alt={'user'}
                            width={30}
                            height={30}
                            className=''
                          />
                          <div className='flex flex-col gap-1'>
                            <span className='text-base font-semibold text-brand-blue hover:underline cursor-pointer'>
                              <a 
                                href={`/pages/account/admin/branch-management/view-branch-details?id=${branch._id}`}
                              >
                                {branch?.name}
                              </a>
                            </span>
                            <span className='text-sm text-text-gray'>{branch?.address}</span>
                            </div>
                        </li>
                      ))}
                    </ul>
                    <p className='text-text-gray text-sm italic px-5 flex flex-col gap-2'>
                      <span className='text-sm text-text-gray'>Total Branches: {userData?.branch?.length}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className='mb-3 font-semibold text-brand-blue'>Branches User is associated with</h3>
                    <p className='text-text-gray text-lg text-center p-10'>This user has not been assigned to any branch yet.</p>
                  </div>
                )}
            </div>
          }

          </div>
          <div className='flex flex-row justify-center items-center gap-5 mx-5 my-2 w-full'>
            <Button
              text={'Update User'}
              onClick={() => {Router.push(`/pages/account/admin/users-management/edit-user?id=${userData._id}`)}}
            />
            <Button
              text={'Exit'}
              onClick={() => {Router.push('/pages/account/admin/users-management')}}
              buttonStyle={`bg-brand-gray px-5 text-brand-blue hover:bg-gray-shadow7`}
            />
          </div>
          <div className=''><PageDescription pageDescription={pageDescription}/></div>
        </div>
      </div>
    </div>
  )
};

export default ViewUserDetails;