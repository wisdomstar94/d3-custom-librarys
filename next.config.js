/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  sassOptions: {
    prependData: `@import "src/styles/common-variables.scss";`, 
  },
}

module.exports = nextConfig
