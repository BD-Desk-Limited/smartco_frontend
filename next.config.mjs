//import withPWA from 'next-pwa';

import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, //enables strict mode in react js to catch bugs in the development phase itself

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

const nextConfigFunction = async (phase, { defaultConfig }) => {
  {
    /*if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    return pwaConfig(nextConfig);
  }*/
  }
  return nextConfig;
};

export default nextConfigFunction;

////function to return the nextConfig object based on the phase of the application build process
//// currrently not in use
//const pwaConfig = withPWA({
//  dest: 'public',
//  scope: '/',
//  sw: 'sw.js',
//  register: true,
//  skipWaiting: true,
//  clientsClaim: true,
//  disable: process.env.NODE_ENV === 'development',
//
//  fallbacks: {
//    document: '/offline',
//  },
//  //runtime caching rules
//  runtimeCaching: [
//    // Manifest
//    {
//      urlPattern: /\/manifest\.json$/i,
//      handler: 'CacheFirst',
//      options: {
//        cacheName: 'manifest-cache',
//      },
//    },
//    // Favicon
//    {
//      urlPattern: /\/favicon\.ico$/i,
//      handler: 'CacheFirst',
//      options: {
//        cacheName: 'favicon-cache',
//      },
//    },
//    // Public images (assets, images)
//    {
//      urlPattern: /^\/(assets|images)\//i,
//      handler: 'CacheFirst',
//      options: {
//        cacheName: 'public-images',
//      },
//    },
//    // JS, CSS, Webpack chunks
//    {
//      urlPattern: /^\/_next\/static\/.*/i,
//      handler: 'CacheFirst',
//      options: {
//        cacheName: 'next-static',
//      },
//    },
//
//    // Images
//    {
//      urlPattern: /^\/_next\/image\/.*/i,
//      handler: 'CacheFirst',
//      options: {
//        cacheName: 'next-images',
//      },
//    },
//
//    // API caching
//    {
//      urlPattern: ({ url }) => url.origin === process.env.NEXT_PUBLIC_API_URL,
//      handler: 'NetworkFirst',
//      options: {
//        cacheName: 'api-cache',
//      },
//    },
//
//    // Dynamic routes/pages: cache all navigation/page requests
//    {
//      urlPattern: /^\/((?!_next|api|static|favicon.ico).)*$/i,
//      handler: 'NetworkFirst',
//      options: {
//        cacheName: 'pages-cache',
//        networkTimeoutSeconds: 10,
//      },
//    },
//    // Explicitly cache sales-point and related dynamic pages
//    {
//      urlPattern: /^\/pages\/(account|auth\/login)\/sales-point(\/.*)?$/i,
//      handler: 'NetworkFirst',
//      options: {
//        cacheName: 'sales-point-pages',
//        networkTimeoutSeconds: 10,
//      },
//    },
//  ],
//});
//
