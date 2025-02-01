import React from 'react';
import Image from 'next/image';

const LoginAuthorize = () => {
    const [error, setError] = React.useState(false);

    return (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="relative">
                {/* Shield image */}
                <Image
                    src="/assets/Shield.png"
                    width={138}
                    height={138}
                    alt="Shield"
                />
                {/* Overlay image */}
                <Image
                    src="/assets/Star.png"
                    width={70}
                    height={76}
                    alt="Top Image"
                    className="absolute top-8 right-8"
                />
            </div>

            <label htmlFor="" className="w-full text-left text-text-black font-semibold text-base">
                Device Name
            </label>
            <input
                type="text"
                placeholder="Device Name"
                className={`w-full border rounded-md px-4 h-10 items-center shadow-sm focus:outline-none text-base ${error ? 'border-2 shadow-none border-error text-error placeholder-error' : 'border-brand-blue'}`}
            />



            <button
                className="bg-brand-blue py-[10px] w-full px-4 gap-[10px] rounded-[5px] flex items-center justify-center text-white text-lg font-semibold"
            >
                Authorize Device
            </button>



        </div>
    );
};

export default LoginAuthorize;
