/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
      domains: ['www.myexamworld.com'], // Add your domain here
    },
    eslint:{
      ignoreDuringBuilds :true,
    }
};

export default nextConfig;
