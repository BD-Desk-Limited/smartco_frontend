'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import OTPInput from './OTPInput';
import { resendOTPService, verifyOTPService } from '@/services/authServices';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';

const OTPForm = () => {
  const { setUser } = useAuth();
  const [otp, setOtp] = useState(new Array(6).fill('')); // Array length depends on the number of inputs needed

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [trustedDevice, setTrustedDevice] = useState(null);

  const [expiryTime, setExpiryTime] = useState(300); // 5 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [purpose, setPurpose] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('email');
      const storedUserId = sessionStorage.getItem('userId');
      const storedTrustedDevice = sessionStorage.getItem('trustedDevice');
      const verificationPurpose = sessionStorage.getItem(
        'verification-purpose'
      );

      // Check if the user is logged in
      if (!storedUserId) {
        router.push('/pages/auth/login');
      } else {
        setEmail(storedEmail);
        setUserId(storedUserId);
        setTrustedDevice(storedTrustedDevice);
        setPurpose(verificationPurpose);
      }
    }
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiryTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (expiryTime === 0) {
      setIsResendDisabled(false);
    }
  }, [expiryTime]);

  const handleOTPResend = async () => {
    const body = {
      user: { email: email, _id: userId },
      trustedDevice,
    };

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await resendOTPService(body);
      if (response.error) {
        setError(response.error);
        return;
      } else if (response.data) {
        setMessage('OTP resent successfully!!!');
        setLoading(false);
      }
    } catch (error) {
      setError('error resending OTP, please try again');
      setLoading(false);
      return;
    }
    setExpiryTime(540); // Reset the timer
    setIsResendDisabled(true); // Disable the resend button
  };

  const handleCancel = () => {
    sessionStorage.clear();
    setOtp(new Array(6).fill(''));
    window.location.href = '/pages/auth/login';
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const body = {
      OTP: Number(otp.join('')),
      userId,
      trustedDevice,
      verificationPurpose: purpose,
    };

    setLoading(true);
    setError('');
    setMessage('');
    // Handle the verification process
    try {
      const response = await verifyOTPService(body);
      if (response.error) {
        setError(response.error);
        return;
      }
      if (response?.data) {
        
        setMessage('OTP verified successfully!!! logging in...');
        setSuccess(true);
        setLoading(false);

        // set user and token in session storage for use in the login attempt notification page. It will be cleared once the user logs in successfully or closes the page.
        sessionStorage.setItem('token', response?.data?.token);
        setUser(response?.data?.user);

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
      
      //clean up the session storage
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('trustedDevice');
      sessionStorage.removeItem('verification-purpose');
    } catch (error) {
      setError('error verifying OTP, please try again');
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden flex items-center justify-center h-full w-full z-20">
      {!success ? (
        <div className="relative overflow-hidden flex items-center justify-center h-full w-full z-20">
          <div className="bg-brand-blue h-[50%] w-[30%] rounded-lg">
            <h1 className="h-[15%] text-text-white text-center flex items-center justify-center">
              Two step verification 2FA
            </h1>
            <div className="h-[70%] bg-white flex flex-col items-center justify-between p-3">
              <span className="text-sm text-center">
                Enter the verification code sent to
                <strong> {email} </strong>
                below
              </span>
              <div className="flex flex-col items-center gap-2">
                <span className="flex flex-col items-center gap-0.5">
                  <OTPInput otp={otp} setOtp={setOtp} />
                  <span className="text-sm">
                    Code expires in{' '}
                    <strong>{`0${formatTime(expiryTime)}`}</strong>
                  </span>
                </span>

                <span>
                  Code not received?{' '}
                  <button
                    onClick={handleOTPResend}
                    disabled={isResendDisabled}
                    className={`${
                      isResendDisabled
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer hover:font-semibold'
                    } text-brand-green`}
                  >
                    Resend Code
                  </button>
                </span>
                <div className="w-full text-center">
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
                  {message && <span className="text-success">{message}</span>}
                </div>
              </div>
              <div className="flex items-center justify-center w-full gap-10">
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-blue-shadow10 p-2 hover:bg-blue-shadow9 px-5 py-2"
                >
                  Cancel
                </button>
                <button
                  disabled={loading || otp.includes('')}
                  onClick={handleVerify}
                  className={`${otp.includes('') ? 'cursor-not-allowed' : 'cursor-pointer'} rounded-lg px-5 py-2 hover:bg-blue-shadow4 bg-brand-blue text-text-white`}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
          {purpose === 'register' && (
            <div className="flex justify-center items-center gap-2 pt-5">
              <span className="h-2 w-2 bg-brand-blue rounded-[100%]"></span>
              <span className="h-0.5 w-10 bg-brand-blue"></span>
              <span className="h-2 w-2 bg-brand-blue rounded-[100%]"></span>
              <span className="h-0.5 w-10 bg-brand-gray"></span>
              <span className="h-2 w-2 bg-brand-gray rounded-[100%]"></span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative overflow-hidden flex items-center justify-center h-full z-20 gap-1 flex-col">
          <motion.h1
            className="text-5xl font-bold flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={'/assets/verified.png'}
              alt=""
              width={150}
              height={150}
            />
          </motion.h1>
          <div className="text-center">{message}</div>
        </div>
      )}
      <div className="absolute bottom-[40vh] left-[10vw] z-0">
        <Image
          src="/assets/brand_mark1.png"
          alt="Logo"
          width={250}
          height={250}
        />
      </div>
      <div className="absolute bottom-[10vh] right-[-20vw] z-0">
        <Image
          src="/assets/brand_mark2.png"
          alt="Logo"
          width={650}
          height={650}
        />
      </div>
    </div>
  );
};

export default OTPForm;
