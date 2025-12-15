import { getPostsByType } from '@/app/utils/mdx';
import { BlogPost } from '../lib/defs';
import { PostsList } from '../components/ui/PostsList/PostsList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog posts | Jared Cunha',
  description: 'Blog posts that I’ve written.',
};

export default function BlogIndexPage() {
  const posts = getPostsByType<BlogPost>('blog', (frontmatter, slug) => ({
    type: 'blog',
    title: frontmatter.title,
    date: frontmatter.date,
    slug: frontmatter.slug || slug,
    excerpt: frontmatter.excerpt,
  }));

  return (
    <main className="site-wrap">
      <h1 className="page-title">Blog posts</h1>
      <PostsList headingLevel={2} posts={posts} variant="column" />
    </main>
  );
}
