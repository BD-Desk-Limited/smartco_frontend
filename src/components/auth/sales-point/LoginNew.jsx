import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/contexts/companyDataContext';
import { useAuth } from '@/contexts/authContext';
import ErrorModal from '../commons/ErrorModal';
import { useInternetStatus } from '@/contexts/internetStatusContext';
import { login } from './loginFunctions';

const LoginNew = () => {
  const [form, setForm] = useState({ staffId: '', pin: '' });
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { companyData } = useCompanyData();
  const { toggleUserMode } = useInternetStatus();
  const router = useRouter();

  const body = {
    pin: form.pin,
    staffId: form?.staffId,
    deviceAuthorization: companyData?.authorizationToken,
  };

  const handleLogin = async (e) =>
    await login(
      e,
      body,
      setError,
      setLoading,
      setUser,
      router,
      companyData,
      toggleUserMode
    );

  return (
    <div className="w-full items-center justify-center flex flex-col gap-8 rounded-lg shadow-lg p-10 relative">
      {/* select from esisting users */}
      <div
        onClick={() => router.push('/pages/auth/login/sales-point')}
        className="flex text-left items-center pr-3 rounded-md gap-1 absolute top-0 left-0 hover:bg-gray-shadow10 cursor-pointer"
      >
        <p className="px-3 py-3 bg-gray-shadow9 rounded-[100%] cursor-pointer hover:bg-gray-shadow8">
          <Image
            src="/assets/back_green.png"
            alt="back"
            width={15}
            height={20}
            className=""
          />
        </p>
        <h1 className="flex text-sm font-bold w-full justify-center items-center text-center text-brand-green">
          Select from existing users
        </h1>
      </div>

      <h1 className="text-2xl text-brand-green w-full text-center font-semibold">
        Login to sales point
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email" className="w-full text-left text-base">
            Staff ID
          </label>
          <input
            type="text"
            placeholder="Staff ID"
            value={form.staffId}
            onChange={(e) => setForm({ ...form, staffId: e.target.value })}
            className="w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base border-brand-green"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="password" className="w-full text-left text-base">
            Pin
          </label>
          <div
            className={`flex flex-row justify-between w-full border border-brand-green rounded-md h-10 text-text-black items-center shadow-sm  px-4`}
          >
            <input
              type={showPin ? 'text' : 'password'}
              placeholder="********"
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value })}
              className={`w-full h-full rounded-md items-center focus:outline-none text-base`}
            />
            <Image
              src={
                showPin
                  ? '/assets/eye-closed-green.png'
                  : '/assets/eye-open-green.png'
              }
              alt="show pin"
              width={20}
              height={20}
              onClick={() => setShowPin(!showPin)}
              className="cursor-pointer"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!form.staffId || !form.pin || loading}
          className={`h-10 bg-brand-green rounded-md text-lg text-white ${
            loading || !form.pin || !form.staffId
              ? 'cursor-not-allowed'
              : 'hover:bg-green-shadow3'
          } items-center justify-center`}
        >
          {loading ? (
            <>
              <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-brand-green border-white rounded-full mr-2"></div>
              <span>Loading...</span>
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
      {error && (
        <div className="inset-0 fixed flex flex-col items-center justify-center bg-black bg-opacity-60 z-50">
          <ErrorModal
            message={error}
            title="Error !!!"
            buttonStyle="bg-brand-green"
            onClose={() => setError('')}
          />
        </div>
      )}
    </div>
  );
};

export default LoginNew;
