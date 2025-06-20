import type { Metadata } from 'next';

interface PostFrontmatter {
	title: string;
	date: string;
	description?: string;
	excerpt?: string;
	ogImage?: string;
	coverImage?: string;
	coverImageAltText?: string;
}

interface GeneratePostMetadataOptions {
	frontmatter: PostFrontmatter;
	slug: string;
	type: 'blog' | 'photos';
}

export function generatePostMetadata({
	frontmatter,
	slug,
	type,
}: GeneratePostMetadataOptions): Metadata {
	const title = `${frontmatter.title} | Jared Cunha`;
	const defaultDescription =
		type === 'blog' ? 'Blog post by Jared Cunha' : 'Photo essay by Jared Cunha';

	const description =
		frontmatter.description || frontmatter.excerpt || defaultDescription;

	const url = `https://jaredcunha.com/${type}/${slug}`;

	// For photos, fall back to coverImage if no ogImage
	const ogImage =
		frontmatter.ogImage ||
		(type === 'photos' ? frontmatter.coverImage : null) ||
		'/share-card-generic.jpg';

	// Use coverImageAltText for photos, title as fallback
	const imageAlt = frontmatter.coverImageAltText || frontmatter.title;

	return {
		title,
		description,
		openGraph: {
			title: frontmatter.title,
			description,
			url,
			siteName: 'Jared Cunha',
			type: 'article',
			publishedTime: frontmatter.date,
			authors: ['Jared Cunha'],
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: imageAlt,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: frontmatter.title,
			description,
			images: [ogImage],
		},
		alternates: {
			canonical: url,
		},
	};
}
