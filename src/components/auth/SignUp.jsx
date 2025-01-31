import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PhoneInput from 'react-phone-input-3';
import 'react-phone-input-3/lib/style.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessEmail: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  console.log('Data:', formData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = useCallback((value) => {
    setFormData((prevFormData) => ({ ...prevFormData, phoneNumber: value }));
  }, []);

  const inputStyle = `w-full border-2 rounded-sm px-4 h-8 items-center drop-shadow-md focus:outline-brand-blue text-md border-[#DDDDDD]`;
  const labelStyle = `w-full text-left text-sm font-semibold`;

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      {!success ? (
        <form className='w-full max-w-md'>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <label htmlFor="fullName" className={labelStyle}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
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
                className={inputStyle}
              />
            </div>
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
                className={inputStyle}
              />
            </div>
            <div className="w-full flex flex-col gap-0.5">
              <label htmlFor="phoneNumber" className={labelStyle}>
                Phone Number
              </label>
              <PhoneInput
                country={'ng'}
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                inputClass="w-full h-full border-none outline-none"
                containerClass="w-full"
                buttonClass="w-auto bg-white p-0 text-white"
                dropdownClass="w-auto p-0 bg-white"
              />
            </div>
            <div className={`flex flex-col gap-0.5`}>
              <label htmlFor="password" className={labelStyle}>Password</label>
              <div className='flex flex-row w-full justify-between items-center px-3 rounded-md h-8 focus-within:border-brand-blue border-2 text-base drop-shadow-sm'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className='focus:outline-none w-full h-full items-center text-base shadow-none border border-none bg-inherit'
                />
                <Image
                  src={showPassword ? '/assets/eye-closed.png' : '/assets/eye-open.png'}
                  alt="show"
                  width={20}
                  height={20}
                  onClick={() => setShowPassword(!showPassword)}
                  className='cursor-pointer'
                />
              </div>
            </div>
            <div className={`flex flex-col gap-0.5`}>
              <label htmlFor="confirmPassword" className={labelStyle}>Confirm Password</label>
              <div className='flex flex-row w-full justify-between items-center px-3 rounded-md h-8 focus-within:border-brand-blue border-2 text-base drop-shadow-sm'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='focus:outline-none w-full h-full items-center text-base shadow-none border border-none bg-inherit'
                />
                <Image
                  src={showConfirmPassword ? '/assets/eye-closed.png' : '/assets/eye-open.png'}
                  alt="show"
                  width={20}
                  height={20}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='cursor-pointer'
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="terms" className={labelStyle}>
                I agree to the terms and conditions
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-brand-blue text-white py-2 rounded-sm mt-4"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-500">{message}</p>
          <Link href="/pages/auth/login">
            <a className="text-brand-blue">Go to Login</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SignUp;