/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "example.com", // ← اضافه کردن hostname تصویر خطا
      },
    ],
  },
};

module.exports = nextConfig;
