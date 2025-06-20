import { getMdxSlugs, getMdxBySlug } from '@/app/utils/mdx';
import { generatePostMetadata } from '@/app/utils/metadata';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/app/components/mdx-components';
import { Post } from '@/app/components/ui/Post/Post';
import Date from '@/app/components/Date';
import type { Metadata } from 'next';

interface PhotoPageProps {
	params: Promise<{ slug: string }>;
}

interface PhotoFrontmatter {
	title: string;
	date: string;
	description?: string;
	excerpt?: string;
	coverImage?: string;
	coverImageAltText?: string;
	ogImage?: string;
}

export async function generateMetadata({
	params,
}: PhotoPageProps): Promise<Metadata> {
	const awaitedParams = await params;
	const { frontmatter } = getMdxBySlug('photos', awaitedParams.slug) as {
		frontmatter: PhotoFrontmatter;
		content: string;
	};

	return generatePostMetadata({
		frontmatter,
		slug: awaitedParams.slug,
		type: 'photos',
	});
}

export async function generateStaticParams() {
	// Get all slugs for static generation
	return getMdxSlugs('photos').map((slug) => ({ slug }));
}

export default async function PhotoPostPage({ params }: PhotoPageProps) {
	const awaitedParams = await params;
	const { frontmatter, content } = getMdxBySlug(
		'photos',
		awaitedParams.slug
	) as {
		frontmatter: PhotoFrontmatter;
		content: string;
	};

	return (
		<main>
			<Post>
				<h1>{frontmatter.title}</h1>
				<p className="post__date">
					<Date dateString={frontmatter.date} />
				</p>
				<MDXRemote source={content} components={mdxComponents} />
			</Post>
		</main>
	);
}
