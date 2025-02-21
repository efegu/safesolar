/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["server-safesolar.xyz", "localhost"],
    },
};

module.exports = nextConfig;
