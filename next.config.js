/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // good to add for smaller builds
  images: {
    domains: ["c1.scryfall.com", "img.scryfall.com"],
  },
};

module.exports = nextConfig;
