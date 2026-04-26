'use client';
import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import ErrorInterface from '@/components/account/errorInterface';
import Spinner from '@/components/account/Spinner';
import {
  selfRegisterationCustomerService,
  validateCustomerSelfRegistrationTokenService,
} from '@/services/customerServices';
import { useSearchParams } from 'next/navigation';
import {
  verifyEmail,
  verifyName,
  verifyPhoneNumber,
} from '@/utilities/verifyInput';

const CustomerSelfRegistration = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [customerRegistrationError, setCustomerRegistrationError] =
    React.useState(null);
  const [successfullyRegisteredCustomer, setSuccessfullyRegisteredCustomer] =
    React.useState(false);
  const [message, setMessage] = React.useState('');
  const [mounting, setMounting] = React.useState(true);
  const [tokenVerificationError, setTokenVerificationError] =
    React.useState(null);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Set window dimensions for confetti
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  // validate token and orderId on backend
  useEffect(() => {
    const validateTokenAndOrderId = async () => {
      try {
        setMounting(true);
        if (!token) {
          setTokenVerificationError('Invalid registration link.');
          return;
        }
        // Call a backend API to validate the token
        const response =
          await validateCustomerSelfRegistrationTokenService(token);

        if (response?.data?.valid) {
          setTokenVerificationError(null);
        } else if (response?.error) {
          setTokenVerificationError(
            response?.error?.message || 'Invalid or expired registration link.'
          );
        } else {
          setTokenVerificationError('Unexpected response from server.');
        }
      } catch (error) {
        console.error('Error validating registration link:', error);
        setTokenVerificationError(
          'Failed to validate registration link. Please try again.'
        );
      } finally {
        setMounting(false);
      }
    };

    validateTokenAndOrderId();
  }, [token]);

  // Hide confetti after 10 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleSelfRegisterCustomer = async () => {
    setCustomerRegistrationError(null);
    const { name, email, phone } = formData;

    const emailValidation = verifyEmail(email);
    const phoneValidation = verifyPhoneNumber(phone);
    const nameValidation = verifyName(name);

    const allValidationsPassed = () => {
      if (!nameValidation?.passed) {
        return {
          passed: false,
          message: nameValidation?.message || 'Invalid name',
        };
      }
      if (!emailValidation?.passed) {
        return {
          passed: false,
          message: emailValidation?.message || 'Invalid email',
        };
      }
      if (!phoneValidation?.passed) {
        return {
          passed: false,
          message: phoneValidation?.message || 'Invalid phone number',
        };
      }
      return { passed: true };
    };

    if (!allValidationsPassed().passed) {
      setCustomerRegistrationError(
        allValidationsPassed()?.message || 'Invalid input'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await selfRegisterationCustomerService({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        token,
      });

      if (response?.error) {
        setCustomerRegistrationError(response.error);
        setLoading(false);
        return;
      }
      if (response?.data) {
        setSuccessfullyRegisteredCustomer(true);
        setShowConfetti(true);
        setTokenVerificationError(null);
        setMessage('Registration successful! You can close this window.');
      }
    } catch (error) {
      console.error('Error registering customer:', error);
      setCustomerRegistrationError('Registration failed, please try again.');
    } finally {
      setLoading(false);
      setMounting(false);
    }
  };

  if (mounting) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Spinner size={10} spaceHeight="40px" color="brand-green" />
      </div>
    );
  }

  return (
    <>
      {tokenVerificationError ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <p className="text-center font-bold text-red-600">
            {tokenVerificationError}
          </p>
        </div>
      ) : !successfullyRegisteredCustomer ? (
        <div className="w-[640px]">
          <h2 className="text-lg font-bold mb-4">
            New Customer Self-Registration
          </h2>
          <div className="flex flex-col gap-5 w-full h-full items-center">
            <div className="w-full flex flex-col p-5 gap-5">
              <input
                type="text"
                placeholder="Name"
                className="border rounded-md p-2 outline-none focus:border-brand-green"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Email"
                className="border rounded-md p-2 outline-none focus:border-brand-green"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone (e.g. +2348012345678)"
                className="border rounded-md p-2 outline-none focus:border-brand-green"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <p className="text-sm">
                By registering, you agree to our terms and conditions.
              </p>
              <p className="text-sm text-red-600 h-5">
                {customerRegistrationError && (
                  <ErrorInterface error={customerRegistrationError} />
                )}
              </p>
            </div>

            <button
              className={`px-4 py-2 rounded bg-brand-green hover:bg-green-shadow3 transition-colors ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
              onClick={handleSelfRegisterCustomer}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size={5} spaceHeight="24px" color="white" />{' '}
                  Submitting...
                </span>
              ) : (
                'Submit Registration'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden">
          {showConfetti && (
            <Confetti
              width={dimensions.width - 80}
              height={dimensions.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.1}
            />
          )}
          <div className="text-center h-full">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-center font-bold text-brand-green text-xl">
              {message}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerSelfRegistration;
