/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  sassOptions: {
    prependData: `@import "src/styles/common-variables.scss";`, 
  },
}

module.exports = nextConfig
