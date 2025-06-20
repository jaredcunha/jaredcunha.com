import { getPostsByType } from '@/app/utils/mdx';
import { BlogPost } from '../lib/defs';
import { PostsList } from '../components/ui/PostsList/PostsList';

export default function BlogIndexPage() {
	const posts = getPostsByType<BlogPost>('blog', (frontmatter, slug) => ({
		type: 'blog',
		title: frontmatter.title,
		date: frontmatter.date,
		slug: frontmatter.slug || slug,
		excerpt: frontmatter.excerpt,
	}));

	return (
		<main className="site-wrap site-wrap--contain">
			<h1 className="page-title">Blog posts</h1>
			<PostsList headingLevel={2} posts={posts} variant="column" />
		</main>
	);
}
