/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  sassOptions: {
    prependData: `@import "src/styles/common-variables.scss";`, 
  },
}

module.exports = nextConfig
