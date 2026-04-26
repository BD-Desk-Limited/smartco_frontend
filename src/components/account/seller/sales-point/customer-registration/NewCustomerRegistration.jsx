import React from 'react';
import { FaPrint, FaTimes } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { useNewCustomerRegistration } from '@/contexts/newCustomerRegistrationContect';
import { useRouter } from 'next/navigation';
import {
  verifyEmail,
  verifyName,
  verifyPhoneNumber,
} from '@/utilities/verifyInput';
import ErrorInterface from '@/components/account/errorInterface';
import { registerNewCustomerService } from '@/services/customerServices';
import { useNotification } from '@/contexts/notificationContext';
import Spinner from '@/components/account/Spinner';

const NewCustomerRegistration = () => {
  const { showNotification } = useNotification();
  const { registrationData, setRegistrationData } =
    useNewCustomerRegistration();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [customerRegistrationError, setCustomerRegistrationError] =
    React.useState(null);
  const qrContainerRef = React.useRef(null);
  const router = useRouter();
  const token = registrationData?.token || null;
  const orderId = registrationData?.orderId || null;

  const QRCodeText = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pages/splash/open-pages/customer-self-registration?${new URLSearchParams(
    {
      token: token || '',
    }
  ).toString()}`;
  console.log('Generated QR code text:', QRCodeText);

  const handlePrintQRCode = () => {
    if (qrContainerRef.current) {
      const printWindow = window.open('', '_blank', 'width=400,height=400');
      printWindow.document.write(
        `<html>
            <head>
                <title>Print QR Code</title>
                <style>
                  @media print {
                    @page {
                        width: 80mm;
                        height: 80mm;
                        margin: 0;
                    }
                    body {
                        margin: 5mm;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                    .qr-container {
                        width: 80mm;
                        height: 80mm;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    .qr-container svg {
                        width: 70mm;
                        height: 70mm;
                    }   
                  }
                </style>
            </head>
            <body>
                ${qrContainerRef.current.innerHTML}
            </body>
        </html>`
      );
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }

    setRegistrationData({ token: null, orderId: null });
    router.push('/pages/account/sales-point');
  };

  const handleRegisterCustomer = async () => {
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

      const response = await registerNewCustomerService({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        orderId: orderId,
      });

      if (response?.error) {
        setCustomerRegistrationError(response.error);
        setLoading(false);
        return;
      }
      if (response?.data) {
        showNotification(
          'success',
          'Customer Registered',
          'Customer registration successful.',
          6000
        );
        setRegistrationData({ token: null, orderId: null });
        router.push('/pages/account/sales-point');
      }
    } catch (error) {
      console.error('Error registering customer:', error);
      setCustomerRegistrationError(
        'Failed to register customer, please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if there is registration data available, if not redirect back to sales point home
  React.useEffect(() => {
    if (!registrationData?.token || !registrationData?.orderId) {
      router.push('/pages/account/sales-point');
    }
  }, [registrationData, router]);

  // Check online status on component mount
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <p className="text-center text-error">
          You are currently offline. Sorry, you cannot register a new customer
          while offline.
        </p>
        <button
          className="mt-4 px-4 py-2 rounded bg-brand-green hover:bg-green-shadow3 transition-colors"
          onClick={() => router.push('/pages/account/sales-point')}
        >
          {' '}
          Back to Sales Point
        </button>
      </div>
    );
  }

  return (
    <div
      className={`w-[80vw] h-fit rounded-lg p-6 shadow-lg flex flex-col relative`}
    >
      {/* Close Button */}
      <button
        className="absolute top-0 right-0 rounded-full p-2 transition-colors hover:bg-gray-shadow4 hover:text-gray-700 bg-gray-shadow6"
        onClick={() => router.push('/pages/account/sales-point')}
        title="Close"
      >
        <FaTimes className="text-black" />
      </button>

      <h2 className="text-lg font-bold mb-4">New Customer Registration</h2>
      <div className="flex flex-row gap-5 w-full h-full items-center">
        <div className="w-1/2 flex flex-col p-5 gap-5">
          <input
            type="text"
            placeholder="Name"
            className="border rounded-md p-2 outline-none focus:border-brand-green"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        {/* QR code for self registration */}

        <div className="w-1/3 flex flex-col">
          <span className="w-full text-center">
            Scan QR code for self registration
          </span>
          <div
            ref={qrContainerRef}
            className="w-full min-h-[260px] bg-gray-100 rounded-md flex flex-col items-center justify-center p-3 gap-2"
          >
            <QRCodeSVG
              value={QRCodeText}
              size={180}
              level="H"
              bgColor="#ffffff"
              fgColor="#111827"
            />
            <span className="w-full text-center text-sm">
              Scan with customer device for self registration. This barcode will
              expire in 30 minutes for security purposes.
            </span>
          </div>

          <button
            className="p-2 rounded bg-transparent border border-border-gray hover:bg-gray-200 transition-colors"
            onClick={handlePrintQRCode}
          >
            <FaPrint className="inline-block mr-2" />
            Print QR-Code
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-start gap-4">
        <button
          className={`px-4 py-2 rounded bg-brand-green hover:bg-green-shadow3 transition-colors ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
          onClick={handleRegisterCustomer}
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
  );
};

export default NewCustomerRegistration;
