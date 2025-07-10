import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Cache Next.js optimized images for 1 year
        source: '/_next/image(.*)',
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
