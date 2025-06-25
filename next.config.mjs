import withMDX from '@next/mdx';
import withPlaiceholder from '@plaiceholder/next';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withPlaiceholder(
	withMDX({
		extension: /\.mdx?$/,
		options: {
			// You can add remark/rehype plugins here if needed
		},
	})(nextConfig)
);
