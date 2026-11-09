/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  transpilePackages: [
    '@pvc/shared',
    '@pvc/company-core',
    '@pvc/database',
    '@pvc/model-router',
    '@pvc/workflow-engine',
    '@pvc/agent-runtime',
  ],
  eslint: { ignoreDuringBuilds: false },
  async redirects() {
    return [
      { source: '/departments', destination: '/divisi', permanent: true },
      { source: '/projects', destination: '/proyek', permanent: true },
      { source: '/analytics', destination: '/laporan', permanent: true },
      { source: '/settings', destination: '/pengaturan', permanent: true },
    ];
  },
};
export default nextConfig;
