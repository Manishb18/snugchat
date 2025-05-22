/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jlytlczrcgqwmvsefvkr.supabase.co",
        pathname: "/storage/v1/object/public/chat-media/**",
      },
    ],
  },
};

export default nextConfig;
