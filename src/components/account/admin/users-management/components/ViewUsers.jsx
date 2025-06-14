import Header from '@/components/account/Header';
import SubHeader from '@/components/account/SubHeader';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import UsersManagementSidebar from './UsersManagementSidebar';
import { useRouter } from 'next/navigation';
import { deleteUsersById, getAllUsersByCompanyId, toggleUserStatus } from '@/services/usersServices';
import Spinner from '@/components/account/Spinner';
import { useAuth } from '@/contexts/authContext'; 
import PageDescription from '@/components/account/PageDescription';
import ExportContent from '@/components/account/ExportContent';
import DeleteModal from '@/components/account/DeleteModal';
import DeactivationModal from '@/components/account/DeactivationModal';
import SuccessModal from '@/components/account/SuccessModal';

const ViewUsers = ({pageDescription}) =>{

  const selectedSubMenu = {
    name: 'View All Users',
    link: '/',
  };

  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [selectedBranch, setSelectedBranch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('');
  const [allUsers, setAllUsers] = React.useState([]);
  const [exportContent, setExportContent] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [selectedUserStatus, setSelectedUserStatus] = React.useState('');
  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deactivationErrors, setDeactivationErrors] = React.useState([]);
  const [deactivationMessages, setDeactivationMessages] = React.useState([]);
  const [deleteErrors, setDeleteErrors] = React.useState([]);
  const [deleteMessages, setDeleteMessages] = React.useState([]);
  const [toggleStatusSuccess, setToggleStatusSuccess] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const Router = useRouter();
  const auth = useAuth();
  const loggedInUser = auth.user;

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const {error, data} = await getAllUsersByCompanyId();
        if (error) {
          console.error(error, 'error fetching branches');
        } 
        if (data) {
          setAllUsers(data);
        }
      }
      catch (error) {
        console.error('Error fetching branches:', error);
      }
      finally {
          setLoading(false);
      }
    };
    fetchUsers();
  },[]);

  React.useEffect(() => {
    const filtered = allUsers && allUsers.filter(
      (user) => {
        const result = (
          (
            user?.fullName?.toLowerCase().includes(searchInput.toLowerCase())||
            user?.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
            user?.staffId?.toLowerCase().includes(searchInput.toLowerCase())
          ) &&
          (user?.role === selectedRole || selectedRole === '') &&
          (user?.branch?.map(brnch => brnch.name).includes(selectedBranch) || selectedBranch === '')&&
          (user?.team?.name === selectedTeam || selectedTeam === '') &&
          // Exclude super Admin from the list of users
          (!user?.superAdmin)
        );
        
        return result;
      }
    );
    setFilteredUsers(filtered);
  }, [searchInput, allUsers, selectedRole, selectedBranch, selectedTeam]);

  //extractedAllBranches is an array of arrays, so we need to flatten it, remove null values and make it unique set
  const allBranches = [...new Set(
    allUsers.map(user => (user?.branch))
      .flat()
        .filter(branch => branch !== null)
  )]//Extract branches objects with unique ids
  .reduce((acc, current) => {
    const x = acc.find(item => item._id === current._id);
    if (!x) {
      acc.push(current); // add current to acc if not found
    }
    return acc; // always return the accumulator
  }, []);

  //Extracting all roles from all users and making it unique set
  const allRoles = [
    ...new Set(
      allUsers.map(user => (user?.role))
    )
  ] || [];

  //extracting all teams from all users and making it unique set
  const allTeams = [
    ...new Set(
      allUsers.map(user => (user?.team?.name))
        .filter(team => team !== undefined && team !== null)
    )
  ] || [];

  const handleResetFilters = () => {
    setSelectedBranch('');
    setSelectedRole('');
    setSelectedTeam('');
    setSearchInput('');
  };

  const handleSelectUser = (userId) => {
      if (selectedUsers.includes(userId)) {
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
        setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleUserToChangeStatus = (userId) => {
    setOpenStatusModal(true);
    setSelectedUsers(userId);
  };

  const handleUserToDelete = (userId) => {
    setOpenDeleteModal(true);
    setDeleteErrors([]);
    setDeleteMessages([]);
    setSelectedUsers(userId);
  };

  const handleClose = () => {
    setOpenDeleteModal(false);
    setOpenStatusModal(false);
    setDeactivationErrors([]);
    setDeactivationMessages([]);
    setDeleteErrors([]);
    setDeleteMessages([]);
  };

  const handleDeleteUser = async (userId) => {
    try{
        setLoading(true);
        const response = await deleteUsersById(userId);
        if (response.error) {
            console.error(response.error, 'error deleting users');
            setDeleteErrors([response.error]);
            setDeleteMessages([]);
        }else if (response.data) {
            setDeleteMessages([response.message]);
            setDeleteErrors([]);
            setAllUsers((prev) =>
                prev.filter(user => !userId.includes(user._id))
            );
            setDeleteSuccess(true);
            setSelectedUsers([]);
            setOpenDeleteModal(false);
        }   
    }catch(err){
        console.error('Error deleting users:', err);
        setDeleteErrors(['Error deleting users, please try again']);
        setDeleteMessages([]);
    }finally{
        setLoading(false);
        setSelectedUsers([]);
    }
  };

  const handleChangeUserStatus = async (userId) => {

    try{
        setLoading(true);

        let response;
        if (selectedUserStatus === 'active' || userId.length > 1) {
            //deactivate branches
            response = await toggleUserStatus(userId, 'inactive');
        }else if (selectedUserStatus === 'inactive') {
            //activate branches
            response = await toggleUserStatus(userId, 'active');
        }
        if (response.error) {
            console.error(response.error, 'error changing user status');
            setDeactivationErrors([response.error]);
            setDeactivationMessages([]);
        }else if (response.data) {
            setDeactivationMessages([response.message]);
            setDeactivationErrors([]);
            setAllUsers((prevUsers) =>
                prevUsers.map((user) =>
                    userId.includes(user._id)
                        ? { ...user, is_active: selectedUserStatus === 'active' ? false : true }
                        : user
                )
            );
            setToggleStatusSuccess(true);
            setSelectedUsers([]);
        }
    }catch(err){
        console.error('Error changing branch status:', err);
        setDeactivationErrors(['Error changing user status, please try again']);
        setDeactivationMessages([]);
    }finally{
        setLoading(false);
        setSelectedUsers([]);
    } 
  };

  return (
    <div>
      <div className="w-full sticky top-0 z-50">
        <Header />
      </div>
      <div className="w-full">
          <SubHeader title={'View All Users in your Organisation'}/>
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
          <div className="bg-white p-5 mx-5 my-2 rounded-md h-full flex flex-col gap-5">
            {/* search bar and filters */}
            <div className='flex flex-row gap-5 w-full justify-between items-center'>
              <div className='h-8 px-3 border border-gray-border rounded-md focus:outline-none focus:ring focus:border-brand-blue flex flex-row items-center w-full'>
                  <Image
                      src="/assets/search.png"
                      alt="search"
                      width={15}
                      height={15}
                  />
                  <input
                      type="text"
                      placeholder="Search branch name or email"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="focus:outline-none ml-2 w-full"
                  />
              </div>
              <div className="flex flex-row gap-2 text-sm min-w-fit text-text-gray">
                <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                  <Image
                    src="/assets/filter.png"
                    alt="sort"
                    width={15}
                    height={15}
                  />
                  <select 
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="focus:outline-none cursor-pointer"
                  >
                    <option value={''}>All Teams</option>
                    {allTeams?.map((team) => (
                        <option key={team} value={team} className=''>{team}</option>
                    ))}
                  </select>
                </div>
                <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                  <Image
                    src="/assets/filter.png"
                    alt="sort"
                    width={15}
                    height={15}
                  />
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="focus:outline-none cursor-pointer"
                  >
                    <option value={''}>All Branches</option>
                    {allBranches&&
                      allBranches?.map((branch) => (
                      <option key={branch._id} value={branch?.name} className=''>{branch?.name}</option>
                    ))}
                  </select>
                </div>
                <div className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center'>
                  <Image
                    src="/assets/filter.png"
                    alt="sort"
                    width={15}
                    height={15}
                  />
                  <select 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="focus:outline-none cursor-pointer"
                  >
                      <option value={''}>All Roles</option>
                      {allRoles.length>0 && 
                          allRoles?.map((role, index) => (
                          <option key={index} value={role}>{role}</option>
                      ))}
                  </select>
                </div>
                <button 
                    onClick={handleResetFilters}
                    className='h-8 px-1 border border-gray-border hover:bg-gray-shadow9 rounded-md flex flex-row items-center text-text-black'
                >
                    {`All Users - ${allUsers.length}`}
                </button>
                <button>
                  <Link href='/pages/account/admin/users-management/create-user' className='flex flex-row gap-1 rounded-md bg-brand-blue text-white h-8 px-2 items-center hover:bg-blue-shadow1'>
                      <Image
                          src="/assets/add.png"
                          alt="add"
                          width={15}
                          height={15}
                      />
                      <span className=''>create new user</span>
                  </Link>
                </button>
                <button 
                  className='h-8 px-1 border border-gray-border rounded-md flex flex-row items-center text-text-gray gap-1' 
                  onClick={() => setExportContent(true)}
                >
                  <Image
                    src={'/assets/export.png'}
                    alt="export"
                    width={15}
                    height={15}
                  />
                  <span className=''>Export</span>
                </button>
              </div>
            </div>

            {/* Table */}
            {loading? (
              <Spinner />
              ) : (
                <div className='overflow-x-auto w-full h-full min-h-[50vh]'>
                  <table className='w-full table-auto'>
                    <thead className='bg-gray-shadow8'>
                      <tr className='text-left text-text-black text-sm font-medium'>
                        <th className='px-2 py-2'></th>
                        <th className='px-2 py-2'>Staff ID</th>
                        <th className='px-2 py-2'>Full Name</th>
                        <th className='px-2 py-2'>Email</th>
                        <th className='px-2 py-2'>Team/Dept</th>
                        <th className='px-2 py-2'>Role</th>
                        <th className='px-2 py-2 text-center'>Actions</th>
                        <th className='px-2 py-2'></th>
                      </tr>
                    </thead>
                    <tbody className='text-sm text-text-gray min-h-[40vh] w-full'>
                      {filteredUsers?.length > 0 ? (
                        filteredUsers?.map((user) => (
                          <tr 
                            key={user._id} 
                            className={`border-b border-gray-border hover:bg-gray-shadow10 hover:text-text-black cursor-pointer items-center w-full`}
                            onClick={() => Router.push(`/pages/account/admin/users-management/user-details?id=${user._id}`)}
                          >
                            <td className={`px-2 py-2 text-left`}>
                              <input 
                                type="checkbox"
                                value={user._id}
                                checked={selectedUsers.includes(user._id)}
                                onClick={(e) => e.stopPropagation()} // Stop event propagation
                                onChange={(e) => {
                                  e.stopPropagation(); // Stop event propagation
                                  handleSelectUser(e.target.value);
                                }}
                                className='cursor-pointer'
                              />
                            </td>
                            <td className={`px-2 py-2 text-left`}>{user?.staffId || '-'}</td>
                            <td className={`px-2 py-2 text-left`}>{user?.fullName || '-'}</td>
                            <td className={`px-2 py-2 text-left`}>{user?.email || '-'}</td>
                            <td className={`px-2 py-2 text-left`}>{user?.team?.name || '-'}</td>
                            <td className={`px-2 py-2 text-left ${
                              user?.role === 'admin' ? 'text-error font-semibold' : user?.role === 'manager'? 'text-brand-blue font-semibold ':  ''
                              }`}
                            >
                              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase() || '-'}
                            </td>

                            {/* Actions */}
                            <td className='px-4 py-2 h-full text-left flex flex-row w-full justify-between items-center'>
                              <Image
                                src={user?.is_active? '/assets/switch_active.png': '/assets/switch_inactive.png'}
                                alt="switch"
                                height={9}
                                width={25}
                                onClick={(e) => {
                                    e.stopPropagation(); // Stop event propagation
                                    handleUserToChangeStatus([user._id]);
                                    setSelectedUserStatus(user.is_active? 'active' : 'inactive');
                                }}
                                className='cursor-pointer'
                                title={user?.is_active? 'Deactivate user': 'Activate user'}
                              />
                              <Link 
                                href={`/pages/account/admin/users-management/edit-user?id=${user?._id}`} 
                                title='Edit User' 
                                className=''
                              >
                                <Image
                                  src="/assets/edit.png"
                                  alt="edit"
                                  width={15}
                                  height={15}
                                  onClick={(e) => e.stopPropagation()} // Stop event propagation
                                  className='cursor-pointer'
                                />
                              </Link>
                              <Image
                                src="/assets/delete.png"
                                alt="delete"
                                width={15}
                                height={15}
                                onClick={(e) => {
                                  e.stopPropagation(); // Stop event propagation
                                  handleUserToDelete([user._id]);
                                }}
                                className='cursor-pointer'
                                title='Delete User'
                              />
                            </td>

                            {/* status indicator */}
                            <td className='px-2 py-2 text-left' title={user.is_active? 'Active' : 'Inactive'}>
                              <div className={`w-3 h-3 rounded-full ${user.is_active? 'bg-brand-green' : 'bg-gray-shadow8 shadow-lg'}`}></div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center text-base text-error h-[40vh]">No users found!!!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {selectedUsers.length > 0 && 
                    <div className='sticky bottom-0 bg-white flex flex-row py-1 justify-end px-5 gap-5'>
                      <div
                        className='bg-success text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-90 flex flex-row items-center gap-3'
                      >
                        {`${selectedUsers.length} selected`}
                        <Image
                            src="/assets/delete-white.png"
                            alt="delete"
                            width={20}
                            height={27}
                            onClick={()=>handleUserToDelete(selectedUsers)}
                            className='cursor-pointer'
                            title='Delete Users'
                        />
                        <Image
                          src="/assets/switch_inactive.png"
                          alt="deactivate"
                          width={27}
                          height={27}
                          onClick={()=>{
                              handleUserToChangeStatus(selectedUsers);
                              setSelectedUserStatus('active'); 
                          }}
                          className='cursor-pointer'
                          title='Deactivate Users'
                        />
                      </div>
                      <button
                          onClick={()=> setSelectedUsers([])}
                          className='bg-brand-gray text-white text-sm px-2 py-2 rounded-md mt-5 hover:bg-opacity-80 flex flex-row items-center gap-1'
                      >
                          {`Clear Selection ${selectedUsers.length > 1 ? `(${selectedUsers.length})` : ''}`}
                      </button>
                    </div>
                  }
                </div>
              )
            }
          </div>
          <div className=''><PageDescription pageDescription={pageDescription}/></div>
        </div>
      </div>

      {exportContent && filteredUsers.length > 0 &&
        <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
            <ExportContent
                metadata={{
                    Team: selectedTeam? [selectedTeam]: ["All"],
                    Branch: selectedBranch? [selectedBranch] : ["All"],
                    Role: selectedRole? [selectedRole] : ["All"],
                    'Generated By': [loggedInUser?.fullName],
                    'Generated At': [new Date().toLocaleString()],
                    'Total Users': [filteredUsers.length],
                }}
                data={filteredUsers.map((user, index )=> {
                  return {
                    "S/No": index+1,
                    "Staff ID": user?.staffId || '-',
                    "Name": user?.fullName || '-',
                    "Email": user?.email || '-',
                    "Team/Dept": user?.team?.name || '-',
                    "Role": user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase() || '-',
                    "Date Created": user?.createdAt? new Date(user?.createdAt).toLocaleDateString() : '-',
                  }
                })}
                onClose={() => setExportContent(false)}
                title={'Export Users Data'}
            />
        </div>
      }

      {openDeleteModal && 
        <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
          <DeleteModal
              title={selectedUsers.length>1? 'Delete User':'Delete Users'}
              message={`Are you sure you want to delete the selected ${selectedUsers.length>1? 'users?':'user?'} This action cannot beundone, and all data will be lost.`}
                buttonStyle={'bg-error hover:bg-error-hover text-white'}
              onClose={handleClose}
              onConfirm={() => handleDeleteUser(selectedUsers)}
              loading={loading}
              deleteErrors={deleteErrors}
              deleteMessages={deleteMessages}
          />
        </div>
      }

      {openStatusModal &&
        <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
            <DeactivationModal
                title={
                    selectedUsers.length>1? (
                        selectedUserStatus === 'active'? 'Deactivate users':'Activate users'
                    ):(
                        selectedUserStatus === 'inactive' ? 'Activate user':'Deactivate user'
                    )
                }
                message={
                    `Are you sure you want to ${
                        selectedUserStatus === 'active'? 'deactivate':'activate'
                    } the selected ${
                        selectedUsers.length>1? 'users?':'user?'
                    } ${selectedUserStatus === 'active' ? (`This would stop every activity for the selected ${
                        selectedUsers.length>1? 'users':'user'
                    }`):''}.`
                }
                buttonText={
                    selectedUserStatus === 'active'? 'Deactivate':'Activate'
                }
                buttonStyle={selectedUserStatus === 'active'? 'bg-error hover:bg-error-hover text-white':'bg-success hover:bg-success-hover text-white'}
                onClose={handleClose}
                onConfirm={() => handleChangeUserStatus(selectedUsers)}
                loading={loading}
                deactivationErrors={deactivationErrors}
                deactivationMessages={deactivationMessages}
            />
        </div>
      }

      {toggleStatusSuccess && (
          <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
              <SuccessModal
                  title={selectedUserStatus === 'active'? 'users Deactivated': 'Users Activated'}
                  message={`The selected ${selectedUsers.length>1? 'users':'user'} have been successfully ${selectedUserStatus === 'active'? 'deactivated':'activated'}.`}
                  
                  buttonStyle={'bg-success hover:bg-success-hover text-white'}
                  onClose={() => {
                      setToggleStatusSuccess(false);
                      handleClose();
                  }}
                  loading={loading}
                  loadingText={selectedUserStatus === 'active'? 'Deactivating users...':'Activating users...'}
              />
          </div>
      )}

      {deleteSuccess && (
          <div className='inset-0 fixed bg-black bg-opacity-60 z-50 flex justify-center items-center'>
              <SuccessModal
                  title={'Users Deleted'}
                  message={`The selected ${selectedUsers.length>1? 'users':'user'} have been successfully deleted.`}
                  buttonStyle={'bg-success hover:bg-success-hover text-white'}
                  onClose={() => {
                      setDeleteSuccess(false);
                      handleClose();
                  }}
                  loading={loading}
                  loadingText={'Deleting users...'}
              />
          </div>
      )}

    </div>
  );
};

export default ViewUsers;