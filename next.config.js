/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API: process.env.API,
  },
  images: {
    domains: ['image.tmdb.org'],
  },
};

module.exports = nextConfig;
