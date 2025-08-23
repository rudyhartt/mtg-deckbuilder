/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    domains: ["c1.scryfall.com", "img.scryfall.com"]
  }
};

module.exports = nextConfig;
