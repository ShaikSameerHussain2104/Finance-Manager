/** @type {import('next').NextConfig} */
const nextConfig = {
  // No special configuration needed for PDF generation now
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

