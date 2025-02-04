import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { requestPasswordResetService } from '@/services/authServices';
import { verifyEmail } from '@/utilities/verifyInput';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = React.useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const emailIsValid = verifyEmail(email).passed;
    if (!emailIsValid) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);

    try {
      const response = await requestPasswordResetService(email);
      if (response?.error) {
        setError(response.error);
      } else {
        setMessage(response?.data?.message);
        setError(null);
        setSuccess(true);
        setTimeout(() => {
          router.push('/pages/auth/login');
        }, 7000);
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {!success ? (
        <div className="w-full items-center justify-center flex flex-col gap-8">
          <h1 className="text-2xl text-brand-blue w-full text-center font-semibold">
            Forget Password?
          </h1>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="w-full text-left text-base">
              Email/Phone Number
            </label>
            <input
              type="email"
              placeholder="email/phone number"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
            />
            {error && <p className="text-error text-sm">{error}</p>}
          </div>

          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="bg-brand-blue text-white w-full rounded-md h-10 shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full mr-2"></div>
                <span>Loading...</span>
              </>
            ) : (
              'Submit'
            )}
          </button>

          <Link href={'/pages/auth/login'}>
            <span className="text-brand-blue hover:font-semibold cursor-pointer">
              Return to Sign In Page
            </span>
          </Link>
        </div>
      ) : (
        <div className="w-full items-center justify-center flex flex-col gap-8">
          {isMounted && (
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
          )}
          <div className="w-full text-center">{message}</div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
