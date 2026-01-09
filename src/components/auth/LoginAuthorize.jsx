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
  const [error, setError] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceBranches, setDeviceBranches] = useState([
    { _id: '-1', name: 'All Branches' },
  ]);
  const [allBranches, setAllBranches] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { setCompanyData } = useCompanyData();
  const router = useRouter();

  //fetch all branches for the user's company
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranchesByCompanyId();
        if (response?.data) {
          setAllBranches(response.data);
          setBranchList(response.data);
        } else if (response?.error) {
          console.error('Error fetching branches:', response.error);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    if (user && user.company) {
      fetchBranches();
    }
  }, [user]);

  const handleDeviceAuthorization = async (e) => {
    e.preventDefault();

    setError(false);
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
    const deviceId = '';
    try {
      const body = {
        user: {
          _id: user._id,
          company: user.company,
        },
        deviceId: deviceId,
        deviceName: deviceName,
        deviceBranches: deviceBranches?.map((branch) => branch._id) || [],
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
    const branchId = e.target.value;
    console.log('Selected branchId:', branchId);

    if (branchId == '-1') {
      setDeviceBranches([{ _id: '-1', name: 'All Branches' }]);
      setBranchList(allBranches);
      return;
    }

    const selectedBranch = allBranches.find(
      (branch) => branch._id === branchId
    );

    if (selectedBranch) {
      // Remove "All Branches" if it's already selected
      const updatedBranches = deviceBranches.filter(
        (branch) => branch._id !== '-1'
      );
      // Add the selected branch if not already added
      if (
        !updatedBranches.some((branch) => branch._id === selectedBranch._id)
      ) {
        updatedBranches.push(selectedBranch);
        setDeviceBranches(updatedBranches);
        // update branch list to remove branches already selected
        const newBranchList = allBranches.filter(
          (branch) =>
            !updatedBranches.some((selected) => selected._id === branch._id)
        );
        setBranchList(newBranchList);
      } else {
        setBranchList(allBranches);
      }
    }
  };

  const handleUnselectBranch = (e, branchId) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedBranches = deviceBranches.filter(
      (branch) => branch._id !== branchId
    );

    // If no branches left, default to "All Branches"
    if (updatedBranches.length === 0) {
      updatedBranches.push({ _id: '-1', name: 'All Branches' });
    }
    setDeviceBranches(updatedBranches);
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
          {deviceBranches.length > 0 &&
            !deviceBranches.map((b) => b.name).includes('All Branches') && (
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
            <option value="-1">All Branches</option>
            {/* display all branches not already selected */}
            {branchList?.length > 0 &&
              branchList
                .filter(
                  (branch) =>
                    !deviceBranches.includes(branch._id) &&
                    branch.name !== 'All Branches'
                )
                .map((branch) => (
                  <option key={branch._id} value={branch._id}>
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
