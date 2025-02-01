import next from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js"; //importing constants from next js to use in the next.config.js file


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, //enables strict mode in react js to catch bugs in the development phase itself

  env: {
    //environment variables to be used in the application to store sensitive data like api keys and urls etc 
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages/splash/splash1',
        permanent: false,
      },
    ];
  },
};

//function to return the nextConfig object based on the phase of the application build process
const nextConfigFunction = async (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    
    const withPWA = (await import('@ducanh2912/next-pwa')).default({
      dest: 'public', //directory to store the pwa files
    });

    //returning the nextConfig object enhanced with the pwa configuration
    return withPWA(nextConfig);
  };

  // Returning the default nextConfig object if the phase is not development or production
  return nextConfig;
}

export default nextConfigFunction; //exporting the nextConfigFunction to be used in the next js build process
