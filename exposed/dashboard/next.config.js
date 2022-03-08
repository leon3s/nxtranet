/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  env: {
    API_URL: process.env.API_URL,
    NXTRANET_DOMAIN: process.env.NXTRANET_DOMAIN,
  },
};

module.exports = nextConfig;
