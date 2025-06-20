import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withMDX({
	extension: /\.mdx?$/,
	options: {
		// You can add remark/rehype plugins here if needed
	},
})(nextConfig);
