/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
