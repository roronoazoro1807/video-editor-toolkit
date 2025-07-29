/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Basic experimental features that improve performance
  experimental: {
    webpackBuildWorker: true,
  },
};

module.exports = nextConfig;
