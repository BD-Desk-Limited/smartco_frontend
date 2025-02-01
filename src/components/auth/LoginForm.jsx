import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/authContext';
import { loginService } from '@/services/authServices';
import { useCompanyData } from '@/contexts/companyDataContext';

const LoginForm = () => {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const { setUser } = useAuth();
  const { companyData } = useCompanyData();
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = {
        email: form?.email,
        password: form?.password,
        deviceId: companyData?.id,
      };
      const response = await loginService(form);

      if (!response || response.error) {
        setError(response.error || 'error logging in, please try again');
        return;
      } else if (response?.data) {
        if (response?.data?.verifyOTP) {
          sessionStorage.setItem('userId', response?.data?.user?._id);
          sessionStorage.setItem(
            'trustedDevice',
            response?.data?.trustedDevice
          );
          sessionStorage.setItem('email', response?.data?.user?.email);
          sessionStorage.setItem('verification-purpose', 'login');
          setMessage(response?.data?.message);
          setSuccess(true);

          setTimeout(() => {
            router.push('/pages/auth/verify-otp');
          }, 7000);
          return;
        } else if (response?.data?.token) {
          sessionStorage.setItem('token', response?.data?.token);
          setUser(response?.data?.user);

          if (
            !response?.data?.trustedDevice &&
            response?.data?.user?.role !== 'admin'
          ) {
            router.push('/pages/auth/login-attempt-notification');
          } else if (
            response?.data?.trustedDevice &&
            response?.data?.user?.role === 'admin'
          ) {
            router.push('/pages/dashboard/admin');
          } else if (
            response?.data?.trustedDevice &&
            response?.data?.user?.role === 'manager'
          ) {
            router.push('/pages/dashboard/manager');
          }
        }
      }

      setError(null);
    } catch (error) {
      setError('error logging in, please try again');
      console.error('error logging in', error);
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="password" className="w-full text-left text-base">
                Password
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
              className={`h-10 bg-brand-blue rounded-md text-lg text-white ${loading || !form.email || !form.password
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
    </>
  );
};

export default LoginForm;
