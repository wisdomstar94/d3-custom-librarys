/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  sassOptions: {
    prependData: `@import "src/styles/globals.scss";`, 
  },
}

module.exports = nextConfig
