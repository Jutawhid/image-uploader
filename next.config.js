/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
    ],
    allowFutureImage: true,
  },
}

module.exports = nextConfig
