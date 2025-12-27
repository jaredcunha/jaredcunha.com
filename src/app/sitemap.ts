import { MetadataRoute } from 'next';
import { getMdxSlugs, getMdxBySlug } from '@/app/utils/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jaredcunha.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/photos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ai-usage`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic blog posts
  const blogSlugs = getMdxSlugs('blog');
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => {
    const { frontmatter } = getMdxBySlug('blog', slug) as {
      frontmatter: { date?: string };
    };
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  // Dynamic photo posts
  const photoSlugs = getMdxSlugs('photos');
  const photoRoutes: MetadataRoute.Sitemap = photoSlugs.map((slug) => {
    const { frontmatter } = getMdxBySlug('photos', slug) as {
      frontmatter: { date?: string };
    };
    return {
      url: `${baseUrl}/photos/${slug}`,
      lastModified: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...blogRoutes, ...photoRoutes];
}
