/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.uploadthing.com", // ← برای لینک‌های uploadthing
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh", // ← گاهی uploadthing از زیر دامنه ufs.sh استفاده می‌کند
      },
    ],
  },
};

module.exports = nextConfig;
