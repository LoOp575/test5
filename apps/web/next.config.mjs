/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: ['@pvc/shared','@pvc/company-core','@pvc/database'],
  eslint: { ignoreDuringBuilds: false },
  // Hilangkan duplikat rute: alias Inggris → redirect ke rute kanonik Indonesia
  async redirects() {
    return [
      { source: '/departments', destination: '/divisi', permanent: false },
      { source: '/departments/:path*', destination: '/divisi/:path*', permanent: false },
      { source: '/projects', destination: '/proyek', permanent: false },
      { source: '/projects/:path*', destination: '/proyek/:path*', permanent: false },
      { source: '/analytics', destination: '/laporan', permanent: false },
      { source: '/analytics/:path*', destination: '/laporan/:path*', permanent: false },
      { source: '/settings', destination: '/pengaturan', permanent: false },
      { source: '/settings/:path*', destination: '/pengaturan/:path*', permanent: false },
      { source: '/campus', destination: '/', permanent: false },
    ];
  },
};
export default nextConfig;
