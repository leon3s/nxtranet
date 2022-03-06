/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
