import Spinner from '@/components/account/Spinner';
import { getAllUsersByBranchId } from '@/services/branchServices';
import React from 'react';

const Users = [
    {
        "staffId": 1,
        "fullName": "John Doe",
        "email": "johndoe@example.com",
        "phoneNumber": "1234567890",
        "role": 'admin',
    },
    {
        "staffId": 2,
        "fullName": "Jane Smith",
        "email": "janesmith@example.com",
        "phoneNumber": "0987654321",
        "role": 'seller',
    },
    {
        "staffId": 3,
        "fullName": "Alice Johnson",
        "email": "alicejohnson@example.com",
        "phoneNumber": "1112223333",
        "role": 'manager',
    },
    {
        "staffId": 4,
        "fullName": "Bob Brown",
        "email": "bobbrown@example.com",
        "phoneNumber": "4445556666",
        "role": 'seller',
    },
    {
        "staffId": 5,
        "fullName": "Charlie Davis",
        "email": "charliedavis@example.com",
        "phoneNumber": "7778889999",
        "role": 'manager',
    },
    {
        "staffId": 6,
        "fullName": "Diana Evans",
        "email": "dianaevans@example.com",
        "phoneNumber": "1231231234",
        "role": 'seller',
    },
    {
        "staffId": 7,
        "fullName": "Ethan Foster",
        "email": "ethanfoster@example.com",
        "phoneNumber": "4564564567",
        "role": 'manager',
    },
    {
        "staffId": 8,
        "fullName": "Fiona Green",
        "email": "fionagreen@example.com",
        "phoneNumber": "7897897890",
        "role": 'seller',
    },
    {
        "staffId": 9,
        "fullName": "George Harris",
        "email": "georgeharris@example.com",
        "phoneNumber": "3213213210",
        "role": 'manager',
    },
    {
        "staffId": 10,
        "fullName": "Hannah Irving",
        "email": "hannahirving@example.com",
        "phoneNumber": "6546546543",
        "role": 'seller',
    },
    {
        "staffId": 11,
        "fullName": "Ian Jackson",
        "email": "ianjackson@example.com",
        "phoneNumber": "9879879876",
        "role": 'manager',
    },
    {
        "staffId": 12,
        "fullName": "Julia King",
        "email": "juliaking@example.com",
        "phoneNumber": "1471471470",
        "role": 'seller',
    },
    {
        "staffId": 13,
        "fullName": "Kevin Lewis",
        "email": "kevinlewis@example.com",
        "phoneNumber": "2582582581",
        "role": 'manager',
    },
    {
        "staffId": 14,
        "fullName": "Laura Moore",
        "email": "lauramoore@example.com",
        "phoneNumber": "3693693692",
        "role": 'seller',
    },
    {
        "staffId": 15,
        "fullName": "Michael Nelson",
        "email": "michaelnelson@example.com",
        "phoneNumber": "7417417413",
        "role": 'manager',
    },
];

const UsersInBranch = ({branchId}) => {

    const [loading, setLoading] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                if(!branchId) return;
                const response = await getAllUsersByBranchId(branchId);
                if (response.error) {
                    console.error(response.error, 'Error fetching users');
                    setError('Failed to fetch users');
                    return;
                }else if(response.data) {
                    setUsers(response.data);
                    return;
                }
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [branchId]);

    const sortbyRoles = {};
    const fetchAllRoleTypes = users && users.reduce((acc, user) => {
        if (!acc[user.role]) {
            acc[user.role] = [];
        }
        acc[user.role].push(user);
        return acc;
    }, sortbyRoles);

    const sortedUsers = Object.entries(fetchAllRoleTypes).sort((a, b) => a[0].localeCompare(b[0]));
    const sortedUsersArray = sortedUsers.map(([role, users]) => ({ role, users }));

  return (
    <div className='w-full h-full relative'>
        <div className='text-base font-semibold p-2 bg-white text-text-blue sticky top-[-20px] z-20'>
            <h1>Users in this branch - <strong>Total: {users?.length}</strong></h1>
            
        </div>
        {loading? 
            <Spinner /> :
            (<table className='w-full border border-gray-border rounded-md shadow-md max-h-screen overflow-y-auto scrollbar-thin relative'>
                <thead className='bg-blue-shadow8 font-bold my-1 sticky top-2 z-10'>
                    <tr className='text-left'>
                        <th className='text-sm font-semibold text-text-gray px-5 py-2'>Staff ID</th>
                        <th className='text-sm font-semibold text-text-gray px-5 py-2'>Full Name</th>
                        <th className='text-sm font-semibold text-text-gray px-5 py-2'>Email</th>
                        <th className='text-sm font-semibold text-text-gray px-5 py-2'>Phone Number</th>
                        <th className='text-sm font-semibold text-text-gray px-5 py-2'>Role</th>
                    </tr>
                </thead>

                <tbody className='max-h-[50vh] overflow-y-auto scrollbar-thin z-0'>
                    {
                        users && users.length > 0 ? (
                            sortedUsersArray.map((userGroup) => (
                                <React.Fragment key={userGroup?.role}>
                                    <tr className='bg-background-1'>
                                        <td colSpan="5" className='text-text-gray text-sm pl-5 bg-blue-shadow10 w-full text-right px-2 italic font-semibold'>
                                            {userGroup.role.charAt(0).toUpperCase() + userGroup.role.slice(1)}
                                            <span> - {userGroup?.users?.length}</span>
                                        </td>
                                    </tr>
                                    {userGroup.users.map((user) => (
                                        <tr key={user._id} className='border-b border-gray-border hover:bg-background-2'>
                                            <td className='text-sm text-text-gray px-5 py-2'>{user.staffId || 'N/A'}</td>
                                            <td className='text-sm text-text-gray px-5 py-2'>{user.fullName || 'N/A'}</td>
                                            <td className='text-sm text-text-gray px-5 py-2'>{user.email || 'N/A'}</td>
                                            <td className='text-sm text-text-gray px-5 py-2'>{user.phoneNumber || 'N/A'}</td>
                                            <td className='text-sm text-text-gray px-5 py-2'>{user.role.charAt(0).toUpperCase() + user.role.slice(1) || 'Unknown'}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className='text-center text-error py-2'>No users found in this branch</td>
                            </tr>
                        )
                    }
                </tbody>
        </table>)}
    </div>
  )
}

export default UsersInBranch;