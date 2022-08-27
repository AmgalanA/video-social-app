/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["docs.microsoft.com", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
