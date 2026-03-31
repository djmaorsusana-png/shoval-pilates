/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip type checking and linting during build (handled separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static generation for all pages (this is a private authenticated CRM)
  experimental: {
    // Force all pages to be dynamic
  },
  // Output configuration
  output: 'standalone',
};

export default nextConfig;
