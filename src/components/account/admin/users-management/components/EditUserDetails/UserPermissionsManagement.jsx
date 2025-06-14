import React from 'react';
import { useAuth } from '@/contexts/authContext';
import { allAccess } from '@/utilities/accessLevels';
import ErrorInterface from '@/components/account/errorInterface';

const UserPermissionsManagement = ({ userData, updatedUserData, setUpdatedUserData }) => {
  const [accessLevels, setAccessLevels] = React.useState([]);
  const [error, setError] = React.useState(null);
  const { user } = useAuth();

  React.useEffect(() => {
    setAccessLevels(updatedUserData?.accessLevel || []);
  }, [updatedUserData]);

  const authUserAccessLevels = (user?.accessLevel || [])
    .filter(access => access.accessGranted && access.allowedGrantOthers) || [];

  const authUserHasAllAccessLevels = authUserAccessLevels?.some(
    access => access.accessName === "All_Access" && access.accessGranted
  );

  const authUserAccessAllowedGrantOthers = (accessName)=> {
    const canGrantAccess = authUserAccessLevels?.map(access => access.accessName).includes(accessName)&&
      authUserAccessLevels?.find(access => access.accessName === accessName)?.allowedGrantOthers;

    if(authUserHasAllAccessLevels || user?.superAdmin || canGrantAccess){
      return true; // Authenticated user can grant access
    }
    return false; // Authenticated user cannot grant access
  };

  let userAccessLevelToDisplay;
  // Filter the access levels to only those that the authenticated user can see
  userAccessLevelToDisplay = accessLevels?.filter(access => {
    if (authUserHasAllAccessLevels) return true; // If the authenticated user has "All_Access", show all access levels
    if (user?.superAdmin) return true; // If the authenticated user is a super admin, show all access levels

    // Check if the authenticated user has the specific access level that matches the access level of the user being managed
    const hasAccess = authUserAccessLevels?.some(
      userAccess => userAccess.accessName === access.accessName && userAccess.accessGranted
    );

    if (hasAccess) {
      return true;
    }

    return false;
  })|| [];

  // If the user has "All_Access", show that user have "all access levels"
  if (
    accessLevels?.map(access => access.accessName).includes("All_Access")&& 
    accessLevels?.find(access => access.accessName === "All_Access")?.accessGranted
  ) {
    userAccessLevelToDisplay = [
      {
        accessName: "All_Access",
        accessGranted: true,
        allowedGrantOthers: true,
      }
    ]
  };

  const otherAccessAuthUserCanGrant = () => {
    // Get the access levels that the authenticated user can grant to others that are not already displayed
    let otherAccessNotDisplayed = [];
    if (authUserHasAllAccessLevels || user?.superAdmin) {
      otherAccessNotDisplayed = allAccess?.filter(
        access => !userAccessLevelToDisplay?.map(
          accessDisplay => accessDisplay.accessName
        ).includes(access.accessName)
      )|| [];
    } else {
      // Filter the access levels to only those that the authenticated user can grant to others
      otherAccessNotDisplayed = authUserAccessLevels?.filter(
        access => (
          access.allowedGrantOthers && // Check if the authenticated user can grant this access
          !userAccessLevelToDisplay?.map(
            userAccess => userAccess.accessName
          ).includes(access.accessName)
        )
      );
    }
    return otherAccessNotDisplayed;
  };

  const handleAccessChange = (accessName) => {
    setError(null); // Reset any previous error messag  e

    if (!authUserAccessAllowedGrantOthers(accessName)) {
      setError(`You do not have permission to change the access for ${(access.accessName).split("_")[0] + " " + (access.accessName).split("_")[1]}.`);
      return;
      }

    setUpdatedUserData(prevState => {
      // Use accessLevel or accessLevels, fallback to empty array
      const prevAccessLevels = prevState.accessLevel || []  ;

      // Check if the access already exists
      const accessIndex = prevAccessLevels.findIndex(a => a.accessName === accessName)  ;

      let updatedAccessLevels;
      if (accessIndex !== -1) {
        // Toggle accessGranted for the existing access
        updatedAccessLevels = prevAccessLevels.map((access, idx) =>
          idx === accessIndex
            ? {
                ...access,
                //toggle off allowGrantOthers if access is being revoked
                allowedGrantOthers: access.accessGranted ?  false : access.allowedGrantOthers,
                accessGranted: !access.accessGranted,
                lastModified: new Date().toISOString(),
                modifiedBy: user._id,
              }
            : access
        );
      } else {
        // Add new access level
        updatedAccessLevels = [
          ...prevAccessLevels,
          {
            accessName: accessName,
            accessGranted: true,
            allowedGrantOthers: false,
            lastModified: new Date().toISOString(),
            modifiedBy: user._id,
            grantedOn: new Date().toISOString(),
            grantedBy: user._id,
          }
        ];
        }

      return {
        ...prevState,
        accessLevel: updatedAccessLevels,
      };
    });
  };

  const handleGrantOthersChange = (accessName) => {
    setError(null); // Reset any previous error message

    // Check if the authenticated user has permission to change the allowed to grant others for this access level
    if (!authUserAccessAllowedGrantOthers(accessName)) {
      setError(`You do not have permission to change the allowed to grant others for ${(accessName).split("_")[0] + " " + (accessName).split("_")[1]}.`);
      return;
    }

    //check if the access level is granted before allowing to grant others
    const accessGranted = accessLevels?.find(a => a.accessName === accessName)?.accessGranted;
    if (!accessGranted) {
      setError(
        `Please grant user ${
        (accessName).split("_")[0] + " " + (accessName).split("_")[1]} ${
          accessName!=="All_Access"? "access" : ""
        } before trying to allow them grant others.`
      );
      return;
    };

    setUpdatedUserData(prevState => {
      const prevAccessLevels = prevState.accessLevel || [];
      const accessIndex = prevAccessLevels.findIndex(a => a.accessName === accessName);

      let updatedAccessLevels;
      if (accessIndex !== -1) {
        // Toggle allowedGrantOthers for the existing access
        updatedAccessLevels = prevAccessLevels.map((access, idx) =>
          idx === accessIndex
            ? {
                ...access,
                allowedGrantOthers: !access.allowedGrantOthers,
                lastModified: new Date().toISOString(),
                modifiedBy: user._id,
              }
            : access
        );
      } else {
        // Add new access level if it doesn't exist
        updatedAccessLevels = [
          ...prevAccessLevels,
          {
            accessName: accessName,
            accessGranted: false,
            allowedGrantOthers: true,
            lastModified: new Date().toISOString(),
            modifiedBy: user._id,
          }
        ];
      }

      return {
        ...prevState,
        accessLevel: updatedAccessLevels,
      };
    });
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-2 mr-10 relative h-full'>
      <h2 className='text-text-gray'>Edit user access permissions</h2>
      <div className='flex flex-col gap-2 mt-2 overflow-y-auto scrollbar-thin max-h-[90%] relative'>
        <span className='text-sm text-warning sticky top-0'>
          <strong>Note:</strong>{" "}
          <span>
            This user might have other access permissions you cannot see. You can only see the access permissions they have that you also have access to.
          </span>
        </span>

        { /* Display the access levels the user has in a table format */ }
        {error && <div className='p-2'> <ErrorInterface error={error}/> </div>}
        {userAccessLevelToDisplay?.length > 0 ? (
          <div className='w-full mt-4 overflow-y-auto max-h-[30%] scrollbar-thin sticky top-0'>
            <ul className='flex flex-row bg-gray-shadow5 text-white text-left text-text-gray border-b px-5'>
              <li className='w-1/3 text-left'>Access Name</li>
              <li className='w-1/3 text-center'>Access Granted</li>
              <li className='w-1/3 text-center'>Allowed to Grant Others</li>
            </ul>
            {userAccessLevelToDisplay?.map((access, index) => (
              <ul key={index} className='flex flex-row bg-background-gray text-left text-base py-1 text-text-gray border-b justify-between px-5'>
                <li className='w-1/3 text-left'>
                  {(access.accessName).split("_")[0] + " " + (access.accessName).split("_")[1]}
                </li>
                <li className='w-1/3 text-center'>
                  <span></span>
                  <input
                    type='checkbox'
                    checked={accessLevels?.find(a => a.accessName === access.accessName)?.accessGranted || false}
                    onChange={()=>handleAccessChange(access.accessName)}
                    className='form-checkbox h-4 w-4'
                  />
                </li>
                <li className='w-1/3 text-center'>
                  <span></span>
                  <input
                    type='checkbox'
                    checked={accessLevels?.find(a => a.accessName === access.accessName)?.allowedGrantOthers || false}
                    onChange={()=>handleGrantOthersChange(access.accessName)}
                    className='form-checkbox h-4 w-4'
                  />
                </li>
              </ul>
            ))}
          </div>
        ) : (
          <div className='mt-4 text-text-gray text-center p-10 w-full'>
            No access levels available for this user.
          </div>
        )}

        { /* Display the access levels the authenticated user can grant to others */ }
        {otherAccessAuthUserCanGrant()?.length > 0 ? (
          <div className='mt-4 max-h-[50%] overflow-y-auto scrollbar-thin relative'>
            <h3 className='text-text-gray sticky top-0'>Other access levels you can grant this user:</h3>

            {accessLevels?.some(access => access.accessName==="All_Access" && access.accessGranted) ? (
              <div className='my-4 text-text-gray text-center p-10 w-full'>
                <h3 className='text-text-gray'>This user already have all admin access, there is no other access you can grant.</h3>
              </div>
            ) : (
            <>
              <ul className='flex flex-row bg-gray-shadow5 text-white text-left text-text-gray border-b px-5 sticky top-0'>
                <li className='w-1/3 text-left'>Access Name</li>
                <li className='w-1/3 text-center'>Grant user</li>
                <li className='w-1/3 text-center'>Allow user to Grant Others</li>
              </ul>
              {otherAccessAuthUserCanGrant()?.map((access, index) => (
                <ul key={index} className='flex flex-row bg-background-gray text-left text-base py-1 text-text-gray border-b justify-between px-5'>
                  <li className='w-1/3 text-left'>
                    {(access.accessName).split("_")[0] + " " + (access.accessName).split("_")[1]}
                  </li>
                  <li className='w-1/3 text-center'>
                    <span></span>
                    <input
                      type='checkbox'
                      checked={accessLevels?.map(a => a.accessName).includes(access.accessName)}
                      onChange={()=>handleAccessChange(access.accessName)}
                      className='form-checkbox h-4 w-4'
                    />
                  </li>
                  <li className='w-1/3 text-center'>
                    <span></span>
                    <input
                      type='checkbox'
                      checked={accessLevels?.find(a => a.accessName === access.accessName)?.allowedGrantOthers || false}
                      onChange={()=>handleGrantOthersChange(access.accessName)}
                      className='form-checkbox h-4 w-4'
                    />
                  </li>
                </ul>
              ))}
            </>
            )
            }
          </div>
        ):(
          <div className='my-4'>
            <h3 className='text-text-gray sticky top-0'>Other access levels you can grant this user:</h3>
            <span className='my-8 text-text-gray text-center p-10 w-full'>
              No other access levels available for you to grant to this user.
            </span>
          </div>
        )}

      </div>
    </div>
  )
};

export default UserPermissionsManagement;