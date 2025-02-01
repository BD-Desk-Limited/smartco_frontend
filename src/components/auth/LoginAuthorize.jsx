import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { authorizeDeviceService } from '@/services/authServices';
import { verifyName } from '@/utilities/verifyInput';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LoginAuthorize = () => {
    const [error, setError] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    const handleDeviceAuthorization = async (e) => {
        e.preventDefault();
        const nameValidation = verifyName(deviceName);
        if (!nameValidation.passed) {
            setError(nameValidation.message);
            return;
        }
        setLoading(true);
        setError(null);
        const deviceId = '';
        try {
            const body = {
                user: {
                    _id: user._id,
                    company: user.company,
                },
                deviceId: deviceId,
                deviceName: deviceName,
            };

            const response = await authorizeDeviceService(body);
            console.log(response);
            if (response?.error) {
                setError(response.error);
            } else {
                setMessage(response?.data?.message || 'Device authorized successfully');
                setSuccess(true);
                setTimeout(() => {
                    router.push('/pages/auth/login');
                }, 5000);
            }
        } catch (error) {
            console.error('Error authorizing device:', error);
            setError('Error authorizing device, please try again');
        }
    };

    if (!user) {
        return (
            <div className="items-center gap-3 flex justify-center">
                <div className="loader border-t-4 border-text-blue rounded-full w-16 h-16 animate-spin"></div>
                <p className="text-text-blue ml-3">Loading...</p>
            </div>
        )
    }

    return (
        <>
            {!success ? (
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <div className="relative">
                        {/* Shield image */}
                        <Image
                            src="/assets/Shield.png"
                            width={138}
                            height={138}
                            alt="Shield"
                            loading='lazy'
                            style={{ objectFit: 'cover' }}
                        />
                        {/* Overlay image */}
                        <Image
                            src="/assets/Star.png"
                            width={70}
                            height={76}
                            alt="Top Image"
                            className="absolute top-8 right-8"
                            loading='lazy'
                        />
                    </div>

                    <label htmlFor="" className="w-full text-left text-text-black font-semibold text-base">
                        Device Name
                    </label>
                    <input
                        id="device-name"
                        type="text"
                        required
                        placeholder="Device Name"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 border-error' : 'border-brand-blue'
                            }`}
                    />

                    <button
                        onClick={handleDeviceAuthorization}
                        disabled={loading}
                        className="bg-brand-blue py-[10px] w-full px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-white text-lg font-semibold"
                    >
                        {loading ? (
                            <>
                                <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 border-t-6 border-t-text-blue border-white rounded-full mr-2"></div>
                                <span>Authorization Loading...</span>
                            </>
                        ) : (
                            'Authorize Device'
                        )}
                    </button>

                    {error && (
                        <div className="text-error mt-4">
                            {error}
                        </div>
                    )}
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

export default LoginAuthorize;
