import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/authContext';
import {
  checkDeviceAuthorizationService,
  deviceCompaniesService,
  loginService,
} from '@/services/authServices';
import {
  deviceTokensOf,
  readDeviceCompanies,
  replaceDeviceCompanies,
} from '@/utilities/deviceCompanies';
import { useCompanyData } from '@/contexts/companyDataContext';
import { saveMfaChallenge } from '@/utilities/mfaChallengeStorage';
import { getRememberTokens } from '@/utilities/deviceInfo';

const LoginForm = () => {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const { setUser } = useAuth();
  const { companyData, setCompanyData } = useCompanyData();
  const router = useRouter();

  // The companies this device is authorized for (optional choice of company at login)
  const [deviceCompanies, setDeviceCompanies] = React.useState([]);
  const [deviceCompanyId, setDeviceCompanyId] = React.useState('');
  // The company the login is for once the server asked to choose one, or said the password
  // belongs to another company: { id, name }
  const [company, setCompany] = React.useState(null);
  const [choices, setChoices] = React.useState(null); // { message, companies } while choosing

  React.useEffect(() => {
    const stored = readDeviceCompanies();
    if (!stored.length) return undefined;
    let current = true;
    const pickDefault = (list) =>
      list.some((c) => String(c.id) === String(companyData?.id))
        ? String(companyData.id)
        : '';
    setDeviceCompanies(stored);
    setDeviceCompanyId(pickDefault(stored));
    // drop the companies that no longer trust this device (offline: keep what is stored)
    deviceCompaniesService(stored).then((res) => {
      if (!current || !res.data) return;
      const list = res.data.map((c) => ({
        ...c,
        name: c.name || stored.find((s) => s.id === c.id)?.name || 'Company',
      }));
      replaceDeviceCompanies(list);
      setDeviceCompanies(list);
      setDeviceCompanyId(pickDefault(list));
    });
    return () => {
      current = false;
    };
    // the stored list is read once when the page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the company the next login attempt is for ('' = let the server work it out)
  const targetCompanyId = company?.id || deviceCompanyId || '';

  // this device now works for the company logged in to: load its authorization (branches)
  const switchDeviceCompany = async (companyId) => {
    if (String(companyData?.id) === String(companyId)) return;
    const entry = deviceCompanies.find(
      (c) => String(c.id) === String(companyId)
    );
    if (!entry) return;
    const res = await checkDeviceAuthorizationService({
      companyId: entry.id,
      authorizationToken: entry.authorizationToken,
    });
    if (res.data) {
      setCompanyData({ ...res.data, name: res.data.name || entry.name });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    return submit(targetCompanyId);
  };

  // picked in the "choose a company" window: try the same password for it
  const chooseCompany = (picked) => {
    setChoices(null);
    setCompany(picked);
    submit(picked.id);
  };

  const submit = async (companyId) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        email: form?.email,
        password: form?.password,
        ...(companyId ? { companyId } : {}),
        // this device's authorization for each company; the server uses the account's one
        deviceTokens: deviceTokensOf(deviceCompanies),
        deviceId: companyData?.authorizationToken,
        // Lets the server skip MFA if this browser was remembered in the last 24 hours
        rememberTokens: getRememberTokens(),
      };
      const response = await loginService(body);

      if (!response || response?.error) {
        if (response?.details?.wrongCompanyPassword) {
          // the password is for another of their companies: keep this company, ask again
          setCompany(response.details.company);
          setForm((f) => ({ ...f, password: '' }));
        }
        setError(response?.error || 'error logging in, please try again');
        return;
      } else if (response?.data) {
        if (response.data.chooseCompany) {
          // the email is registered with more than one company
          setChoices({
            message: response.data.message,
            companies: response.data.companies || [],
          });
          return;
        }
        if (response?.data?.verifyOTP) {
          // Second factor required: keep only the server-issued challenge.
          saveMfaChallenge(response.data, 'login');
          // the device works for the company being logged in to from now on
          await switchDeviceCompany(response.data.company);
          setMessage(response?.data?.message);
          setSuccess(true);

          setTimeout(() => {
            router.push('/pages/auth/verify-otp');
          }, 3000);
          return;
        } else if (response?.data?.token) {
          // set user and token in session storage for use in the login attempt notification page. It will be cleared once the user logs in successfully or closes the page.
          sessionStorage.setItem('token', response?.data?.token);
          setUser(response?.data?.user);
          await switchDeviceCompany(response?.data?.user?.company);

          // If the device is not trusted redirect to login attempt notification where admin can register the device and other users gets notified that the device is untrusted.
          if (response?.data.trustedDevice !== 'true') {
            router.push('/pages/auth/login-attempt-notification');
            return;
          }

          // if the device is trusted log them in, then redirect based on role.
          if (
            response?.data.trustedDevice === 'true' &&
            response?.data?.user?.role === 'admin'
          ) {
            router.push('/pages/account/admin');
          } else if (
            response?.data.trustedDevice === 'true' &&
            response?.data?.user?.role === 'manager'
          ) {
            router.push('/pages/account/manager');
          } else {
            setError('unauthorized user role, please contact admin');
            return;
          }
        }
      }
    } catch (error) {
      setError('error logging in, please try again');
      console.error('error logging in', error);
      sessionStorage.removeItem('token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!success ? (
        <div className="w-full items-center justify-center flex flex-col gap-8">
          <h1 className="text-2xl text-brand-blue w-full text-center font-semibold">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email" className="w-full text-left text-base">
                Email/Phone Number
              </label>
              <input
                type="text"
                placeholder="email/phone number"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setCompany(null);
                }}
                className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
              />
            </div>
            {company ? (
              <div className="flex flex-wrap items-center justify-between gap-2 w-full rounded-md bg-blue-shadow10 px-3 py-2 text-sm">
                <span>
                  Logging in to{' '}
                  <span className="font-semibold text-text-black">
                    {company.name || 'the company you chose'}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCompany(null);
                    setError(null);
                  }}
                  className="text-brand-blue hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              deviceCompanies.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="company"
                    className="w-full text-left text-base"
                  >
                    Company{' '}
                    <span className="text-text-gray text-sm">(optional)</span>
                  </label>
                  <select
                    id="company"
                    value={deviceCompanyId}
                    onChange={(e) => setDeviceCompanyId(e.target.value)}
                    className="w-full border border-brand-blue rounded-md px-3 h-10 bg-white shadow-sm focus:outline-none text-base"
                  >
                    <option value="">Any of my companies</option>
                    {deviceCompanies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="password" className="w-full text-left text-base">
                {company?.name ? `Password for ${company.name}` : 'Password'}
              </label>
              <div
                className={`flex flex-row justify-between w-full border ${error ? 'border-2 shadow-none border-error text-error' : 'border-brand-blue'} rounded-md h-10 text-text-black items-center shadow-sm  px-4`}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`${error && 'placeholder-error text-error'} w-full h-full rounded-md items-center focus:outline-none text-base`}
                />
                <Image
                  src={
                    showPassword
                      ? '/assets/eye-closed.png'
                      : '/assets/eye-open.png'
                  }
                  alt="show"
                  width={20}
                  height={20}
                  onClick={handleTogglePassword}
                  className="cursor-pointer"
                />
              </div>
              <Link
                href="/pages/auth/forgot-password"
                className="text-sm hover:font-semibold text-brand-blue cursor-pointer w-fit"
              >
                Forgot Password?
              </Link>
            </div>
            {error && (
              <span className="text-error w-full text-center text-base items-center flex justify-center gap-2">
                <Image
                  src={'/assets/error.png'}
                  alt="errorr"
                  width={20}
                  height={20}
                />
                <span>{error}</span>
              </span>
            )}
            <button
              type="submit"
              disabled={!form.email || !form.password || loading}
              className={`h-10 bg-brand-blue rounded-md text-lg text-white ${
                loading || !form.email || !form.password
                  ? 'cursor-not-allowed'
                  : 'hover:bg-blue-shadow1'
              } items-center justify-center`}
            >
              {loading ? (
                <>
                  <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full mr-2"></div>
                  <span>Loading...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
          <span className="text-base text-text-black">
            Don&apos;t have an account?{' '}
            <Link href={'/pages/auth/sign-up'}>
              <span className="text-brand-blue hover:font-semibold cursor-pointer">
                Sign Up
              </span>
            </Link>
          </span>
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
      {choices && (
        <div
          className="fixed inset-0 z-[90] bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setChoices(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="choose-company-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] flex flex-col gap-3 max-h-[85dvh] overflow-y-auto"
          >
            <h2
              id="choose-company-title"
              className="text-lg font-semibold text-text-black leading-tight"
            >
              Choose a company
            </h2>
            <p className="text-sm text-text-gray leading-snug">
              {choices.message ||
                'Your email is registered with more than one company.'}{' '}
              Each company has its own password.
            </p>
            <ul className="flex flex-col gap-2">
              {choices.companies.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => chooseCompany(c)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-border hover:border-brand-blue hover:bg-blue-shadow10 text-text-black"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setChoices(null)}
              className="self-end text-sm text-text-gray hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
