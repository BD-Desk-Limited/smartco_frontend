import { useState } from 'react';
import { useTheme } from '@/contexts/themeContext';
import Button from '../../Button';
import { FaChevronLeft, FaLock } from 'react-icons/fa';
import Spinner from '../../Spinner';
import ErrorInterface from '../../errorInterface';
import { changePinService } from '@/services/authServices';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/authContext';
import Image from 'next/image';

const ChangePin = () => {
  const { mode, lightThemeStyle, darkThemeStyle } = useTheme();
  const router = useRouter();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [repeatNewPin, setRepeatNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user, setUser } = useAuth();
  console.log('user', user);

  const onSubmit = async (e) => {
    e.preventDefault();

    const isDigits = (str) => {
      return /^\d+$/.test(str);
    };

    if (!newPin || newPin.length < 6 || !isDigits(newPin)) {
      seterror('New pin must be 6 digits number');
      return;
    }

    if (repeatNewPin !== newPin) {
      seterror('New pin does not match');
      return;
    }

    if (newPin === oldPin) {
      seterror('Old pin and new pin cannot be same');
      return;
    }

    try {
      setLoading(true);
      const formData = {
        oldPin,
        newPin,
        repeatNewPin,
      };
      const response = await changePinService(formData);

      if (response?.data && response?.data?.success) {
        //clear traces of old token and other credentials
        localStorage.removeItem(`token_${user.staffId}`);
        sessionStorage.removeItem('token');
        setUser(null);
        setSuccess(true);
      }
      if (response?.error) {
        seterror(response.error || 'An Error occured while changing your pin');
      }
    } catch (err) {
      console.error(err || 'error changing pin');
      seterror(err || 'An arror occured while changing your pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${mode === 'light' ? lightThemeStyle : darkThemeStyle} h-screen w-full flex flex-col justify-center items-center`}
    >
      {success ? (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            className="w-[25%] h-[45%] rounded-md shadow-inner flex flex-col items-center justify-between"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className=" h-[15%] bg-brand-green text-text-white w-full rounded-t-md text-center flex justify-center items-center">
              Change pin
            </h1>
            <Image
              src="/assets/verified.png"
              alt="error"
              width={50}
              height={50}
            />
            <p className="text-base text-center text-success">
              Pin changed successfully!!
            </p>
            <button
              onClick={() => router.push('/pages/auth/login/sales-point')}
              className={`py-2 px-5 my-2 text-text-white rounded-md shadow-md bg-brand-green hover:bg-green-shadow1`}
            >
              {'OK'}
            </button>
            <footer className="bg-brand-green h-[15%] w-full rounded-b-md"></footer>
          </motion.div>
        </div>
      ) : (
        <>
          <button
            className="flex flex-row items-center p-3 cursor-pointer hover:underline text-brand-green"
            onClick={() => router.push('/pages/account/sales-point')}
          >
            <FaChevronLeft className="text-brand-green" />
            <FaChevronLeft className="text-brand-green" />
            <FaChevronLeft className="text-brand-green" />
            Back to salespoint
          </button>
          <form
            onSubmit={onSubmit}
            className="flex-col flex w-72 border rounded-t-md shadow-sm items-center"
          >
            <h3 className="mb-10 text-lg font-semibold bg-brand-green w-full p-2 text-center rounded-t-md">
              Change Pin
            </h3>
            <div className="flex flex-col gap-2 px-5">
              <label className="flex flex-col">
                <span>Old Pin:</span>
                <input
                  type="password"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="******"
                  className="bg-inherit border rounded-md p-1 px-2  text-lg"
                />
              </label>

              <label className="flex flex-col">
                <span>New Pin:</span>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="******"
                  className="bg-inherit border rounded-md p-1 px-2  text-lg"
                />
              </label>

              <label className="flex flex-col">
                <span>Repeat new Pin:</span>
                <input
                  type="password"
                  value={repeatNewPin}
                  onChange={(e) => setRepeatNewPin(e.target.value)}
                  placeholder="******"
                  className="bg-inherit border rounded-md p-1 px-2  text-lg"
                />
              </label>
            </div>

            <p className="h-5 py-3 px-2">
              {error && <ErrorInterface error={error} />}
            </p>

            <button
              className={`${loading ? 'cursor-not-allowed' : 'cursor-pointer'} w-[80%] px-5 py-3 rounded-md m-5 flex flex-row justify-center items-center gap-2 bg-brand-green hover:bg-green-shadow1`}
              disabled={loading}
            >
              {loading ? (
                <Spinner spaceHeight="12px" size={8} color="white" />
              ) : (
                <>
                  <FaLock />
                  <span>change pin</span>
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChangePin;
