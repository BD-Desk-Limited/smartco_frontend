import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { authorizeDeviceService } from '@/services/authServices';
import { verifyName } from '@/utilities/verifyInput';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { useCompanyData } from '@/contexts/companyDataContext';
import { motion } from 'framer-motion';
import { getAllBranchesByCompanyId } from '@/services/branchServices';

const LoginAuthorize = () => {
  const [error, setError] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceBranches, setDeviceBranches] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { setCompanyData, companyData } = useCompanyData();
  const router = useRouter();

  //fetch all branches for the user's company
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await getAllBranchesByCompanyId();
        if (response?.data) {
          const branchesAvailableForSelection = [
            { _id: '-1', name: 'All Branches' },
            ...response.data,
          ];
          setBranchList(branchesAvailableForSelection);
          setAllBranches(branchesAvailableForSelection);
        } else if (response?.error) {
          console.error('Error fetching branches:', response.error);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.company) {
      fetchBranches();
    }
  }, [user]);

  const handleDeviceAuthorization = async (e) => {
    e.preventDefault();

    setError('');
    const nameValidation = verifyName(deviceName);
    if (!nameValidation.passed) {
      setError(nameValidation.message);
      return;
    }

    if (deviceBranches.length === 0) {
      setError('Please select at least one branch for the device to access');
      return;
    }
    setLoading(true);
    const deviceId = companyData.authorizationToken
      ? companyData.authorizationToken
      : '';

    try {
      // If "All Branches" is selected, send all branch IDs except one with synthetic _id = '-1' in the company to the backend
      let selectedBranchesIds = [];
      if (deviceBranches.some((branch) => branch._id === '-1')) {
        selectedBranchesIds = allBranches
          .map((branch) => branch._id)
          ?.filter((id) => id !== '-1');
      } else {
        selectedBranchesIds = deviceBranches?.map((branch) => branch._id);
      }

      const body = {
        user: {
          _id: user._id,
          company: user.company,
        },
        deviceId: deviceId,
        deviceName: deviceName,
        deviceBranches: selectedBranchesIds,
      };

      const response = await authorizeDeviceService(body);
      if (response?.error) {
        setError(response.error);
      }

      if (response?.data) {
        setMessage(response?.data?.message || 'Device authorized successfully');
        setSuccess(true);

        //register device to local storage and in state before redirecting
        const companydata = {
          id: user.company,
          authorizationToken: response?.data?.deviceId,
          allowedBranches: response?.data?.allowedBranches || [], //list of branches the device can access
        };

        setCompanyData(companydata);

        setTimeout(() => {
          router.push('/pages/account/admin');
        }, 5000);
      }
    } catch (error) {
      console.error('Error authorizing device:', error);
      setError('Error authorizing device, please try again');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="items-center gap-3 flex justify-center">
        <div className="loader border-t-4 border-text-blue rounded-full w-16 h-16 animate-spin"></div>
        <p className="text-text-blue ml-3">Loading...</p>
      </div>
    );
  }

  const handleAddToDeviceBranches = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    const branchId = e.target.value;

    const selectedBranch = allBranches.find(
      (branch) => branch._id === branchId
    );

    if (!selectedBranch) {
      setError('please select a branch');
      setDeviceBranches([]);
      setBranchList(allBranches);
      return;
    }

    // Remove "All Branches" if it's already selected
    const deviceBranchesWithoutAll = deviceBranches?.filter(
      (branch) => branch._id !== '-1'
    );

    // If "All Branches" is selected, clear all other branches and select only "All Branches"
    if (branchId === '-1') {
      setDeviceBranches([{ _id: '-1', name: 'All Branches' }]);
      setBranchList(allBranches.filter((branch) => branch._id === '-1'));
      return;
    }

    let updatedDeviceBranches = [];
    updatedDeviceBranches = [...deviceBranchesWithoutAll];
    // check if selected branch is not already added
    const alreadySelected = updatedDeviceBranches.some(
      (branch) => branch._id === selectedBranch._id
    );
    if (!alreadySelected) {
      updatedDeviceBranches?.push(selectedBranch);
      setDeviceBranches(updatedDeviceBranches);
      // update branch list to remove branches already selected
      const newBranchList = allBranches.filter((branch) => {
        const notInUpdatedDeviceBranches = !updatedDeviceBranches.some(
          (updateBranch) => updateBranch._id === branch._id
        );
        return notInUpdatedDeviceBranches;
      });
      setBranchList(newBranchList);
    }
  };

  const handleUnselectBranch = (e, branchId) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    const updatedBranches = deviceBranches.filter(
      (branch) => branch._id !== branchId
    );
    setDeviceBranches(updatedBranches);

    // If "All Branches" is unselected, clear all branches from deviceBranches
    if (branchId === '-1') {
      setDeviceBranches([]);
    }

    // update branch list to add back the unselected branch
    const newBranchList = allBranches.filter((branch) => {
      const notInUpdatedBranches = !updatedBranches.some(
        (updateBranch) => updateBranch._id === branch._id
      );
      return notInUpdatedBranches;
    });
    setBranchList(newBranchList);
  };

  return (
    <>
      {!success ? (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="relative">
            {/* Shield image */}
            <Image
              src="/assets/Shield.png"
              width={138}
              height={138}
              alt="Shield"
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
            {/* Overlay image */}
            <Image
              src="/assets/Star.png"
              width={70}
              height={76}
              alt="Top Image"
              className="absolute top-8 right-8"
              loading="lazy"
            />
          </div>

          <label
            htmlFor=""
            className="w-full text-left text-text-black font-semibold text-base"
          >
            Device Name
          </label>
          <input
            id="device-name"
            type="text"
            required
            placeholder="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${
              error ? 'border-2 border-error' : 'border-brand-blue'
            }`}
          />

          <label
            htmlFor=""
            className="w-full text-left text-text-black font-semibold text-base"
          >
            Select Device Branch(es)
          </label>
          {/* Display selected branches */}
          {deviceBranches.length > 0 && (
            <div className="w-full border border-border-gray rounded-md px-4 h-10 grid grid-cols-4 gap-2">
              {deviceBranches.map((branch) => (
                <span
                  key={branch.name}
                  className="bg-blue-shadow5 text-white p-1 rounded-full text-sm flex items-center justify-center text-center"
                >
                  <span
                    onClick={(e) => handleUnselectBranch(e, branch._id)}
                    value={branch._id}
                    className="mr-2 font-bold bg-error w-4 h-4 flex items-center justify-center rounded-full text-white text-sm cursor-pointer"
                    type="button"
                    title={`Remove ${branch.name} from selection`}
                  >
                    &times;
                  </span>
                  {branch.name}
                </span>
              ))}
            </div>
          )}

          <select
            className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${
              error ? 'border-2 border-error' : 'border-brand-blue'
            }`}
            onChange={(e) => handleAddToDeviceBranches(e)}
          >
            <option value=" " className="cursor-not-allowed">
              --- Select Branches ---
            </option>
            {/* display all branches not already selected */}
            {branchList?.length > 0 &&
              branchList.map((branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                  className={`${branch._id === '-1' ? 'font-bold text-error' : ''}`}
                >
                  {branch.name}
                </option>
              ))}
          </select>

          <button
            onClick={handleDeviceAuthorization}
            disabled={loading}
            className="bg-brand-blue hover:bg-blue-shadow5 py-[10px] w-full px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-white text-lg font-semibold"
          >
            {loading ? (
              <>
                <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full mr-2"></div>
                <span>Authorization Loading...</span>
              </>
            ) : (
              'Authorize Device'
            )}
          </button>

          {error && <div className="text-error mt-4">{error}</div>}
        </div>
      ) : (
        <div className="w-full items-center justify-center flex flex-col gap-8">
          <motion.h1
            className="text-white text-5xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3 }}
          >
            <Image
              src={'/assets/verified.png'}
              alt=""
              width={150}
              height={150}
            />
          </motion.h1>

          <div className="w-full text-center">{message}</div>
        </div>
      )}
    </>
  );
};

export default LoginAuthorize;
