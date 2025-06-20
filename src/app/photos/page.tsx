import { getPostsByType } from '@/app/utils/mdx';
import { PhotoPost } from '../lib/defs';
import { PostsList } from '../components/ui/PostsList/PostsList';

export default function PhotoIndexPage() {
	const posts = getPostsByType<PhotoPost>('photos', (frontmatter, slug) => ({
		type: 'photos',
		title: frontmatter.title,
		date: frontmatter.date,
		slug: frontmatter.slug || slug,
		excerpt: frontmatter.excerpt,
		coverImage: frontmatter.coverImage,
		coverImageAltText: frontmatter.coverImageAltText,
	}));

	return (
		<main className="site-wrap site-wrap--contain">
			<h1 className="page-title">Photo essays</h1>
			<PostsList headingLevel={2} posts={posts} variant="grid-med" />
		</main>
	);
}
