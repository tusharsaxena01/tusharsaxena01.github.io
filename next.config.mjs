/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        unoptimized: true,
    },
    basePath: "/test_portfolio",
    assetPrefix: "/test_portfolio/",
};
export default nextConfig;
