import { getMdxSlugs, getMdxBySlug } from '@/app/utils/mdx';
import { generatePostMetadata } from '@/app/utils/metadata';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/app/components/mdx-components';
import { Post } from '@/app/components/ui/Post/Post';
import rehypePrettyCode from 'rehype-pretty-code';
import Date from '@/app/components/Date';
import type { Metadata } from 'next';

const mdxOptions = {
	mdxOptions: {
		remarkPlugins: [],
		rehypePlugins: [
			[
				rehypePrettyCode,
				{
					theme: 'github-dark',
					keepBackground: true,
					defaultLang: 'plaintext',
					grid: false,
					bypassInlineCode: false,
				},
			],
		],
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

interface BlogPageProps {
	params: Promise<{ slug: string }>;
}

interface BlogFrontmatter {
	title: string;
	date: string;
	description?: string;
	excerpt?: string;
	ogImage?: string;
}

export async function generateMetadata({
	params,
}: BlogPageProps): Promise<Metadata> {
	const awaitedParams = await params;
	const { frontmatter } = getMdxBySlug('blog', awaitedParams.slug) as {
		frontmatter: BlogFrontmatter;
		content: string;
	};

	return generatePostMetadata({
		frontmatter,
		slug: awaitedParams.slug,
		type: 'blog',
	});
}

export async function generateStaticParams() {
	// Get all slugs for static generation
	return getMdxSlugs('blog').map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPageProps) {
	const awaitedParams = await params;
	const { frontmatter, content } = getMdxBySlug('blog', awaitedParams.slug) as {
		frontmatter: BlogFrontmatter;
		content: string;
	};

	return (
		<main>
			<Post>
				<h1>{frontmatter.title}</h1>
				<p className="post__date">
					<Date dateString={frontmatter.date} />
				</p>

				<MDXRemote
					source={content}
					components={mdxComponents}
					options={mdxOptions}
				/>
			</Post>
		</main>
	);
}
