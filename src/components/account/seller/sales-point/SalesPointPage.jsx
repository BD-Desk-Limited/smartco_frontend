import React, { use, useEffect } from 'react';
import { useCompanyData } from '@/contexts/companyDataContext';
import { useAuth } from '@/contexts/authContext';
import SalesPoint from './sales-items/SalesPoint';
import SelectWorkBranch from './SelectWorkBranch';
import WarningModal from '../../WarningModal';
import { useRouter } from 'next/navigation';
import ErrorModal from '@/components/auth/commons/ErrorModal';
import Spinner from '../../Spinner';
import ShiftManagement from './shift-management/ShiftManagement';

const SalesPointPage = () => {
  const router = useRouter();
  const { companyData } = useCompanyData();
  const { user, logOutSalesPoint, isLoading } = useAuth();
  const [mode, setMode] = React.useState('light');
  const [activeMenuItem, setActiveMenuItem] = React.useState('Sales Items');
  const [userBranchAccessWarning, setUserBranchAccessWarning] =
    React.useState(false);
  const [userBranchAccessWarningBranch, setUserBranchAccessWarningBranch] =
    React.useState(null);
  const [deviceNotAuthorizedForAnyBranch, setDeviceNotAuthorizedForAnyBranch] =
    React.useState(false);
  const [workBranch, setWorkBranch] = React.useState(null);
  const menuItems = [
    {
      name: 'Sales Items',
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
  // Memoized list of branches accessible on the device to avoid unnecessary rerenders
  const branchesAccessibleOnDevice = React.useMemo(
    () => companyData?.allowedBranches || [],
    [companyData?.allowedBranches]
  );

  const darkThemeStyle = `bg-[#242424] text-text-white`;
  const lightThemeStyle = `bg-white text-text-black`;

  const handleWorkBranchSelect = (branch_obj) => {
    // check if user has access to the branch
    if (!user?.branch?.includes(branch_obj?._id)) {
      setUserBranchAccessWarning(true);
      setUserBranchAccessWarningBranch(branch_obj);
    } else {
      setWorkBranch(branch_obj);
      sessionStorage.setItem('work-branch', branch_obj._id);
    }
  };

  // Device authorization for branches check
  const noBranches =
    !branchesAccessibleOnDevice || branchesAccessibleOnDevice.length === 0;

  React.useEffect(() => {
    if (noBranches && !deviceNotAuthorizedForAnyBranch) {
      setDeviceNotAuthorizedForAnyBranch(true);
    } else if (!noBranches && deviceNotAuthorizedForAnyBranch) {
      setDeviceNotAuthorizedForAnyBranch(false);
    }
  }, [noBranches, deviceNotAuthorizedForAnyBranch]);

  //if only one branch is accessible on the device, auto select it as workBranch if user has access
  React.useEffect(() => {
    if (branchesAccessibleOnDevice?.length === 1) {
      const singleBranch = branchesAccessibleOnDevice[0];
      if (user?.branch?.includes(singleBranch._id)) {
        setWorkBranch(singleBranch);
        sessionStorage.setItem('work-branch', singleBranch._id);
      }
    }
  }, [branchesAccessibleOnDevice, user, isLoading]);

  if (!companyData || !companyData.allowedBranches) {
    return <Spinner />;
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${mode === 'light' ? lightThemeStyle : darkThemeStyle}`}
    >
      {/* Select Branch */}
      {branchesAccessibleOnDevice.length > 0 && !workBranch?._id && (
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
            message={`Sorry, this device is not authorized for any branch use, kindly contact your admin for assistance`}
            buttonStyle={`bg-error text-white`}
            onClose={logOutSalesPoint}
          />
        </div>
      )}

      {/* check if the branch the user has logged into is active */}
      {workBranch && workBranch.status !== 'active' && (
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-100 flex items-center justify-center z-50`}
        >
          <ErrorModal
            title="Inactive Branch"
            message={`Sorry, this branch is inactive, kindly contact your admin for assistance`}
            buttonStyle={`bg-error text-white`}
            onClose={logOutSalesPoint}
          />
        </div>
      )}

      {/* Shift Creation Enforcement Check */}
      {/*workBranch && workBranch.settings.shiftCreationEnforced && (
        <ShiftManagement
          onClose={logOutSalesPoint}
          style={mode === 'light' ? lightThemeStyle : darkThemeStyle}
        />
      )*/}

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
