/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, //enables strict mode in react js to catch bugs in the development phase itself

  experimental: {
    agentUpgrade: 'security',
  },

  env: {
    //environment variables to be used in the application to store sensitive data like api keys and urls etc
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
