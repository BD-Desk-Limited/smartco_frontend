import React from 'react';
import { useCompanyData } from '@/contexts/companyDataContext';
import { useAuth } from '@/contexts/authContext';
import SalesPoint from './SalesPoint';
import SelectWorkBranch from './SelectWorkBranch';
import WarningModal from '../../WarningModal';
import { useRouter } from 'next/navigation';
import ErrorModal from '@/components/auth/commons/ErrorModal';

//const branchesAccessibleOnDevice = [
//  { _id: 'branch1', name: 'Main Branch' },
//  { _id: 'branch2', name: 'Secondary Branch' },
//  { _id: 'branch3', name: 'Warehouse Branch' },
//  { _id: 'branch4', name: 'Outlet Branch' },
//  { _id: 'branch5', name: 'Downtown Branch' },
//  { _id: 'branch6', name: 'Uptown Branch' },
//  { _id: 'branch7', name: 'Suburban Branch' },
//];
const SalesPointPage = () => {
  const router = useRouter();
  const { companyData } = useCompanyData();
  const { user, logOutSalesPoint } = useAuth();
  const branchesAccessibleOnDevice = companyData?.allowedBranches || [];
  const [mode, setMode] = React.useState('light');
  const [activeMenuItem, setActiveMenuItem] = React.useState('Dashboard');
  const [userBranchAccessWarning, setUserBranchAccessWarning] =
    React.useState(false);
  const [userBranchAccessWarningBranch, setUserBranchAccessWarningBranch] =
    React.useState(null);
  const [deviceNotAuthorizedForAnyBranch, setDeviceNotAuthorizedForAnyBranch] =
    React.useState(false);
  const [workBranch, setWorkBranch] = React.useState(null);
  const menuItems = [
    {
      name: 'Dashboard',
      component: null,
      iconPath: {
        light: '/assets/window_white.png',
        dark: '/assets/window_dark.png',
        active: '/assets/window_green.png',
      },
    },
    {
      name: 'Cart',
      iconPath: {
        light: '/assets/cart_white.png',
        dark: '/assets/cart_dark.png',
        active: '/assets/cart_green.png',
      },
    },
    {
      name: 'Customers',
      iconPath: {
        light: '/assets/customers_white.png',
        dark: '/assets/customers_dark.png',
        active: '/assets/customers_green.png',
      },
    },
    {
      name: 'Payments',
      iconPath: {
        light: '/assets/card_white.png',
        dark: '/assets/card_dark.png',
        active: '/assets/card_green.png',
      },
    },
  ];

  const darkThemeStyle = `bg-black text-text-white`;
  const lightThemeStyle = `bg-white text-text-black`;

  {
    /*
  Workflow:

  //check if the branch the user has logged into is active
    --//if not active, show an error message saying the branch is not active
    --//else proceed to the next step
  
  // check if the branch has shiftcreation enforcement enabled
    --//if enabled, check if there is an active shift for the branch
      ----//if no active shift, show a message telling the user they have not been invited to any shift yet
      ----//else show the active shift details and allow the user to select it and proceed to the next step
    ----//else proceed to the next step

  //main sales point interface
  */
  }

  const handleWorkBranchSelect = (branch) => {
    // check if user has access to the branch
    if (!user?.branch?.includes(branch._id)) {
      setUserBranchAccessWarning(true);
      setUserBranchAccessWarningBranch(branch);
    } else {
      setWorkBranch(branch);
      sessionStorage.setItem('work-branch', branch._id);
    }
  };

  if (!branchesAccessibleOnDevice || branchesAccessibleOnDevice.length === 0) {
    setDeviceNotAuthorizedForAnyBranch(true);
    return null;
  }

  if (branchesAccessibleOnDevice.length === 1 && !workBranch?._id) {
    const onlyBranch = branchesAccessibleOnDevice[0];
    handleWorkBranchSelect(onlyBranch);
  }

  return (
    <div className="relative">
      {/* Select Branch */}
      {branchesAccessibleOnDevice.length > 1 && !workBranch?._id && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50`}
        >
          <SelectWorkBranch
            branchesAccessibleOnDevice={branchesAccessibleOnDevice}
            handleWorkBranchSelect={handleWorkBranchSelect}
            logOutSalesPoint={logOutSalesPoint}
            style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
          />
        </div>
      )}

      {/* User Branch Access Warning Modal */}
      {userBranchAccessWarning && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-100 flex items-center justify-center z-50`}
        >
          <WarningModal
            title="Access Denied"
            message={`Sorry, you do not have access to ${userBranchAccessWarningBranch?.name}, kindly contact your admin for assistance`}
            onClick={() => {
              setWorkBranch(null);
              setUserBranchAccessWarning(false);
            }}
            onClose={() => router.push(`/pages/auth/login/sales-point`)}
            button1Text={`Choose another branch`}
            button2Text={`Logout`}
          />
        </div>
      )}

      {/* No Branches Authorized for Device */}
      {deviceNotAuthorizedForAnyBranch && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-100 flex items-center justify-center z-50`}
        >
          <ErrorModal
            title="Unauthorized Device"
            message={`Sorry, this device is not authorized for any branch, kindly contact your admin for assistance`}
            buttonStyle={``}
            onClose={logOutSalesPoint}
          />
        </div>
      )}

      {/* Main Sales Point Interface */}

      <SalesPoint
        mode={mode}
        setMode={setMode}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        lightThemeStyle={lightThemeStyle}
        darkThemeStyle={darkThemeStyle}
        logOutSalesPoint={logOutSalesPoint}
      />
    </div>
  );
};

export default SalesPointPage;
