/** @type {import('next').NextConfig} */

/**
 * Principal Resolution // Institutional Configuration v2.6
 * Purpose: Hardening the digital harbor for production.
 * Focus: Expert Accuracy and Institutional Stability.
 */
const nextConfig = {
  reactStrictMode: true,
  
  /* Absolute Candor: We restricted remote patterns to specific trusted assets.
     This prevents 'Information Decay' and unauthorized asset injection.
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
        pathname: '/patterns/**',
      },
      // Placeholder for future institutional CDN
      /* {
        protocol: 'https',
        hostname: 'cdn.principalresolution.com',
      } 
      */
    ],
  },

  /* Results: Optimizing for effectiveness and board-level performance */
  poweredByHeader: false, // Omit institutional tech-stack signatures for security.
};

export default nextConfig;