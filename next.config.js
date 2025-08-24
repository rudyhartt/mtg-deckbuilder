/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "c1.scryfall.com",
      "c2.scryfall.com",
      "c3.scryfall.com",
      "img.scryfall.com",
      "cards.scryfall.io",
    ],
  },
};

module.exports = nextConfig;
