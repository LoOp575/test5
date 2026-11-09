/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['@pvc/shared','@pvc/company-core','@pvc/database'],
  eslint: { ignoreDuringBuilds: false },
};
export default nextConfig;
