import { getMdxSlugs, getMdxBySlug, getAdjacentPosts } from '@/app/utils/mdx';
import { generatePostMetadata } from '@/app/utils/metadata';
import { generateArticleSchema } from '@/app/utils/json-ld';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/app/components/mdx-components';
import { Post } from '@/app/components/ui/Post/Post';
import { PostNavigation } from '@/app/components/ui/PostNavigation/PostNavigation';
import Date from '@/app/components/Date';
import type { Metadata } from 'next';
import { Suspense } from 'react';

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
    awaitedParams.slug,
  ) as {
    frontmatter: PhotoFrontmatter;
    content: string;
  };

  // Get adjacent posts for navigation
  const { previous, next } = getAdjacentPosts(
    'photos',
    awaitedParams.slug,
    (frontmatter, slug) => ({
      type: 'photos' as const,
      title: frontmatter.title,
      date: frontmatter.date,
      slug: frontmatter.slug || slug,
      excerpt: frontmatter.excerpt || '',
      coverImage: frontmatter.coverImage,
      coverImageAltText: frontmatter.coverImageAltText,
    }),
  );

  // Generate JSON-LD structured data
  const articleSchema = generateArticleSchema(
    {
      type: 'photos',
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt || frontmatter.description || '',
      slug: awaitedParams.slug,
      coverImage: frontmatter.coverImage,
      ogImage: frontmatter.ogImage,
    },
    `https://jaredcunha.com/photos/${awaitedParams.slug}`,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main>
        <Post>
          <h1>{frontmatter.title}</h1>
          <p className="post__date">
            <Date dateString={frontmatter.date} />
          </p>
          <Suspense fallback={<>Loading...</>}>
            <MDXRemote source={content} components={mdxComponents} />
          </Suspense>

          <PostNavigation previous={previous} next={next} type="photos" />
        </Post>
      </main>
    </>
  );
}
