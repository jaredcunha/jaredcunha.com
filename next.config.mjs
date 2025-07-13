import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Longer cache since Cloudinary handles most optimization
    minimumCacheTTL: 31536000, // 1 year (365 days)
    // Add Cloudinary domain for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Keep Next.js optimization for fallback/non-Cloudinary images
    unoptimized: false,
  },
  async headers() {
    return [
      {
        // Cache Next.js optimized images for 1 year
        // These are now mostly just Cloudinary images passed through Next.js
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Cloudinary images directly (if any are loaded without Next.js Image)
        source: '/(.*\\.(?:jpg|jpeg|png|webp|gif|svg)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withMDX({
  extension: /\.mdx?$/,
  options: {
    // You can add remark/rehype plugins here if needed
  },
})(nextConfig);
