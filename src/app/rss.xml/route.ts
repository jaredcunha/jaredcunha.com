import RSS from 'rss';
import { getPostsByType } from '@/app/utils/mdx';
import { BlogPost, PhotoPost } from '@/app/lib/defs';

// Get the base URL for the site
function getBaseUrl() {
  // Always use production domain in production, even on Vercel
  if (process.env.NODE_ENV === 'production') {
    return 'https://jaredcunha.com';
  }
  // Use Vercel preview URL for preview deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export async function GET() {
  try {
    const baseUrl = getBaseUrl();

    // Get blog posts
    const blogPosts = getPostsByType<BlogPost>('blog', (frontmatter, slug) => ({
      type: 'blog',
      title: frontmatter.title,
      date: frontmatter.date,
      slug: frontmatter.slug || slug,
      excerpt: frontmatter.excerpt,
      coverImage: frontmatter.coverImage,
      coverImageAltText: frontmatter.coverImageAltText,
    }));

    // Get photo posts
    const photoPosts = getPostsByType<PhotoPost>(
      'photos',
      (frontmatter, slug) => ({
        type: 'photos',
        title: frontmatter.title,
        date: frontmatter.date,
        slug: frontmatter.slug || slug,
        excerpt: frontmatter.excerpt,
        coverImage: frontmatter.coverImage,
        coverImageAltText: frontmatter.coverImageAltText,
      })
    );

    // Combine and sort all posts by date
    const allPosts = [...blogPosts, ...photoPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Create RSS feed
    const feed = new RSS({
      title: 'Jared Cunha',
      description: 'Blog posts and photo essays by Jared Cunha',
      feed_url: `${baseUrl}/rss.xml`,
      site_url: baseUrl,
      image_url: `${baseUrl}/images/_ui/logo.png`,
      managingEditor: 'Jared Cunha',
      webMaster: 'Jared Cunha',
      copyright: `${new Date().getFullYear()} Jared Cunha`,
      language: 'en',
      categories: [
        'Design',
        'Technology',
        'Photography',
        'Accessibility',
        'Civic tech',
        'Web development',
      ],
      pubDate: allPosts.length > 0 ? new Date(allPosts[0].date) : new Date(),
      ttl: 60,
    });

    // Add items to feed
    allPosts.forEach((post) => {
      const postUrl = `${baseUrl}/${post.type}/${post.slug}`;
      const postType = post.type === 'blog' ? 'Blog post' : 'Photo essay';

      feed.item({
        title: post.title,
        description: post.excerpt,
        author: 'Jared Cunha',
        url: postUrl,
        guid: postUrl,
        categories: [postType],
        date: new Date(post.date),
        enclosure: post.coverImage
          ? {
              url: `${baseUrl}${post.coverImage}`,
              type: 'image/jpeg',
            }
          : undefined,
      });
    });

    const xml = feed.xml({ indent: true });

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
