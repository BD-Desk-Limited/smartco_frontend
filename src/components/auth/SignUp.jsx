import { useState, Fragment } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/app/globals.css';
import {
  verifyEmail,
  verifyInputText,
  verifyName,
  verifyPassword,
  verifyPhoneNumber,
} from '@/utilities/verifyInput';
import { signupService } from '@/services/authServices';
import CurrencyLocationMatch from './CurrencyLocationMatch';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    businessAddress: '',
    country: '',
    currency: {
      code: '',
      symbol: '',
      name: '',
    },
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, phoneNumber: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!verifyEmail(formData.businessEmail).passed) {
      setError(verifyEmail(formData.businessEmail).message);
      setLoading(false);
      return;
    }

    if (
      !formData.fullName ||
      !formData.businessName ||
      !formData.businessEmail ||
      !formData.businessAddress ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.currency.code ||
      !formData.currency.symbol ||
      !formData.currency.name
    ) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!verifyPhoneNumber(formData.phoneNumber).passed) {
      setError(verifyPhoneNumber(formData.phoneNumber).message);
      setLoading(false);
      return;
    }

    if (!verifyName(formData.fullName).passed) {
      setError(verifyName(formData.fullName).message);
      setLoading(false);
      return;
    }

    if (!verifyName(formData.businessName).passed) {
      setError(verifyName(formData.businessName).message);
      setLoading(false);
      return;
    }

    if (!verifyInputText(formData.businessAddress).passed) {
      setError(verifyInputText(formData.businessAddress).message + ' (Invalid address)');
      setLoading(false);
      return;
    }

    if (!verifyPassword(formData.password).passed) {
      setError(verifyPassword(formData.password).message);
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    if (!verifyPassword(formData.password).passed) {
      setError(verifyPassword(formData.password).message);
      setLoading(false);
      return;
    }

    try {

      setLoading(true);

      const body = {
        fullName: formData.fullName,
        businessName: formData.businessName,
        businessEmail: formData.businessEmail,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        businessAddress: formData.businessAddress,
        currency: formData.currency,
        terms: formData.terms,
      };

      const response = await signupService(body);
      if (response && response.data) {
        setMessage(response.data.message);

        sessionStorage.setItem('email', response.data?.user?.email);
        sessionStorage.setItem('userId', response.data?.user?._id);
        sessionStorage.setItem('trustedDevice', response.data?.trustedDevice);
        sessionStorage.setItem('verification-purpose', 'registration');

        setSuccess(true);
        const timer = setTimeout(() => {
          window.location.href = '/pages/auth/verify-otp';
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        setError(response.error || 'error signing up, please try again');
      }
    } catch (err) {
      console.error('error signing up:', err);
      setError(err.message || 'error signing up, please try again');
    } finally {
      setLoading(false);
    }
  };
  console.log('Form Data:', formData);

  const inputStyle = `w-full border-2 rounded-sm px-4 h-8 items-center drop-shadow-md focus:outline-brand-blue text-md border-[#DDDDDD]`;
  const labelStyle = `w-full text-left text-sm font-semibold`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-text-gray">
      {!success ? (
        <form className="w-full flex-col flex gap-3" onSubmit={handleSubmit}>
          <h1 className="text-lg font-bold mb-2 text-brand-blue text-center">SIGN UP YOUR BUSINESS</h1>
          <div className="flex flex-col gap-3 w-full max-h-[80vh] overflow-y-auto">
            {/* Full Name Input */}
            <div className="flex flex-col gap-0.5 w-full">
              <label htmlFor="fullName" className={labelStyle}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`${inputStyle} ${formData.fullName?.length ? 'border-brand-blue' : ''} focus-within:border-brand-blue`}
              />
            </div>
            {/* Business Name Input */}
            <div className="flex flex-col gap-0.5">
              <label htmlFor="businessName" className={labelStyle}>
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`${inputStyle} ${formData.businessName?.length ? 'border-brand-blue' : ''} focus-within:border-brand-blue`}
              />
            </div>
            {/* Business Email Input */}
            <div className="flex flex-col gap-0.5">
              <label htmlFor="businessEmail" className={labelStyle}>
                Business Email
              </label>
              <input
                type="email"
                id="businessEmail"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                className={`${inputStyle} ${formData.businessEmail?.length ? 'border-brand-blue' : ''} focus-within:border-brand-blue`}
              />
            </div>
            {/* Business Address Input */}
            <div className="flex flex-col gap-0.5">
              <label htmlFor="businessAddress" className={labelStyle}>
                Business Address
              </label>
              <textarea
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                placeholder='Enter your business address...'
                className={`w-full border-2 p-2 items-center drop-shadow-md focus:outline-brand-blue text-md border-[#DDDDDD] h-24 font-mono rounded-md ${formData.businessAddress?.length ? 'border-brand-blue' : ''} focus-within:border-brand-blue`}
              />
            </div>
            {/* Country Input */}
            <div className="flex flex-col gap-0.5">
              <CurrencyLocationMatch
                dataObject={formData}
                setDataObject={setFormData}
              />
            </div>
            {/* Phone Number Input */}
            <div className="w-full flex flex-col gap-0.5">
              <label htmlFor="phoneNumber" className={labelStyle}>
                Phone Number
              </label>
              <div
                className={`${formData?.phoneNumber?.length ? 'border-brand-blue' : ''} focus-within:border-brand-blueflex flex-row w-full justify-between items-center px-3 rounded-md h-8 focus-within:border-brand-blue border-2 text-base drop-shadow-sm`}
              >
                <Fragment>
                  <PhoneInput
                    value={formData.phoneNumber}
                    onChange={(value) => handlePhoneChange(value)}
                  />
                </Fragment>
              </div>
            </div>
            {/* Password Input */}
            <div className={`flex flex-col gap-0.5`}>
              <label htmlFor="password" className={labelStyle}>
                Password
              </label>
              <div
                className={`flex flex-row w-full justify-between items-center px-3 rounded-md h-8 ${formData.password.length ? 'border-brand-blue' : ''} focus-within:border-brand-blue border-2 text-base drop-shadow-sm`}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="focus:outline-none w-full h-full items-center text-base shadow-none border border-none bg-inherit"
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {/* Confirm Password Input */}
            <div className={`flex flex-col gap-0.5`}>
              <label htmlFor="confirmPassword" className={labelStyle}>
                Confirm Password
              </label>
              <div className="flex flex-row w-full justify-between items-center px-3 rounded-md h-8 focus-within:border-brand-blue border-2 text-base drop-shadow-sm">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="focus:outline-none w-full h-full items-center text-base shadow-none border border-none bg-inherit"
                />
                <Image
                  src={
                    showConfirmPassword
                      ? '/assets/eye-closed.png'
                      : '/assets/eye-open.png'
                  }
                  alt="show"
                  width={20}
                  height={20}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {/* Password Requirements */}
            <div className="flex flex-row justify-between px-1">
              <p className="flex flex-row justify-center items-center bg-[#F2F2F2] rounded-md">
                <Image
                  src={
                    verifyPassword(formData.password).verifyLength
                      ? '/assets/checkbox_green.png'
                      : '/assets/checkbox_gray.png'
                  }
                  alt="success"
                  width={40}
                  height={40}
                />
                <span
                  className={`${verifyPassword(formData.password).verifyLength ? 'text-success' : 'text-brand-gray'} text-sm font-semibold`}
                >
                  8 characters
                </span>
              </p>
              <p className="flex flex-row justify-center items-center bg-[#F2F2F2] rounded-md">
                <Image
                  src={
                    verifyPassword(formData.password).verifyContainsUpperCase
                      ? '/assets/checkbox_green.png'
                      : '/assets/checkbox_gray.png'
                  }
                  alt="success"
                  width={40}
                  height={40}
                />
                <span
                  className={`${verifyPassword(formData.password).verifyContainsUpperCase ? 'text-success' : 'text-brand-gray'} text-sm font-semibold`}
                >
                  1 Uppercase
                </span>
              </p>
              <p className="flex flex-row justify-center items-center bg-[#F2F2F2] rounded-md">
                <Image
                  src={
                    verifyPassword(formData.password)
                      .verifyContainsSpecialCharacter
                      ? '/assets/checkbox_green.png'
                      : '/assets/checkbox_gray.png'
                  }
                  alt="success"
                  width={40}
                  height={40}
                />
                <span
                  className={`${verifyPassword(formData.password).verifyContainsSpecialCharacter ? 'text-success' : 'text-brand-gray'} text-sm font-semibold`}
                >
                  Special Character
                </span>
              </p>
            </div>
            {/* Terms and Conditions */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={(e) =>
                  setFormData({ ...formData, terms: e.target.checked })
                }
                className="h-4 w-4"
              />
              <label htmlFor="terms" className="text-sm">
                By accessing or using our services, you agree to our
                <Link
                  href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}`}
                  target="_blank"
                  className="text-brand-blue font-semibold hover:underline"
                >
                  {` `}Terms and Conditions
                </Link>
              </label>
            </div>
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
            //onClick={}
            className={`w-full bg-brand-blue text-white py-2 rounded-md mt-2 ${loading ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-blue-shadow6'}`}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <span className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/pages/auth/login">
              <span className="text-brand-blue font-semibold hover:underline">
                Sign in
              </span>
            </Link>
          </span>
          <div className="flex justify-center items-center gap-2 pt-5">
            <span className="h-2 w-2 bg-brand-blue rounded-[100%]"></span>
            <span className="h-0.5 w-10 bg-brand-gray"></span>
            <span className="h-2 w-2 bg-brand-gray rounded-[100%]"></span>
            <span className="h-0.5 w-10 bg-brand-gray"></span>
            <span className="h-2 w-2 bg-brand-gray rounded-[100%]"></span>
          </div>
        </form>
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
    </div>
  );
};

export default SignUp;
