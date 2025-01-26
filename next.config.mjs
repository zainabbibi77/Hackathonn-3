/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io', // Replace with the actual hostname you want to allow
        },
      ],
    },
  };
  
  export default nextConfig;
  