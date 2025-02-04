import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPasswordResetLinkService, resetPasswordService } from '@/services/authServices';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ResetPassword = ({ token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const router = useRouter();

    const handleToggleNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (!token) {
                    setError('Invalid or missing reset token.');
                    setIsVerifying(false);
                    return;
                }
                const response = await verifyPasswordResetLinkService(token);
                if (response.error) {
                    setError(response.error || 'Invalid token.');
                } else {
                    setIsTokenValid(true);
                }
            } catch (error) {
                setError('An error occurred while verifying the token.');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);

        try {
            const body = { newPassword, confirmPassword, token };
            console.log('Body:', body);
            const response = await resetPasswordService(body);

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
    const handleCancel = () => {
        router.push('/pages/auth/login');
    }
    if (isVerifying) {
        return (

            <div className="items-center gap-3 flex justify-center">
                <div className="loader border-t-4 border-text-blue rounded-full w-16 h-16 animate-spin"></div>
                <p className="text-text-blue ml-3 ">Verifying token...</p>
            </div>

        );
    }

    if (!isTokenValid) {
        return (

            <div className="text-center">
                <p className="text-red-500">Invalid or expired token. Please try again.</p>
            </div>

        );
    }

    return (
        <div className="relative overflow-hidden flex items-center justify-center h-full w-full z-20">
            {!success ? (
                <div className="relative overflow-hidden flex items-center justify-center h-full w-full z-20">
                    <div className='h-[50%] w-full bg-white rounded-lg flex flex-col items-center justify-between'>
                        <div className="bg-brand-blue w-full py-5 flex items-center justify-center rounded-t-lg">
                            <h1 className="text-text-white">
                                Set Password
                            </h1>
                        </div>

                        <div className="w-full bg-white flex flex-col items-center justify-between p-3">
                            <span className="text-sm text-center text-[#7D8482]">
                                New Password must be at least 8 characters
                            </span>
                            <div className="flex flex-col items-center h-[50%] justify-between gap-4 mt-4 w-[80%]">

                                <div className="w-full gap-2 flex flex-col">
                                    <label htmlFor="newPassword" className="w-full text-left text-sm text-gray-shadow5">
                                        New Password
                                    </label>

                                    <div className="relative w-full">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="********"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={`w-full border rounded-md px-4 pr-10 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
                                        />
                                        <Image
                                            src={
                                                showNewPassword
                                                    ? '/assets/eye-closed.png'
                                                    : '/assets/eye-open.png'
                                            }
                                            alt="show"
                                            width={20}
                                            height={20}
                                            onClick={handleToggleNewPassword}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="w-full gap-2 flex flex-col">
                                    <label htmlFor="confirmPassword" className="w-full text-left text-sm text-gray-shadow5">
                                        Confirm Password
                                    </label>

                                    <div className="relative w-full">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="********"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full border rounded-md px-4 pr-10 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
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
                                            onClick={handleToggleConfirmPassword}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        />
                                    </div>
                                </div>

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
                                    disabled={loading}
                                    onClick={handlePasswordReset}
                                    className="rounded-lg px-5 py-2 hover:bg-blue-shadow4 bg-brand-blue text-text-white"
                                >
                                    Continue
                                </button>
                            </div>

                        </div>
                        <div className="bg-brand-blue w-full py-5 flex items-center justify-center rounded-b-lg">

                        </div>
                    </div>

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

export default ResetPassword;
