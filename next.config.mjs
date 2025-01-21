/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
