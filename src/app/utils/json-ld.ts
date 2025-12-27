import { Post } from '@/app/lib/defs';

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting';
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url: string;
  };
  publisher: {
    '@type': 'Person';
    name: string;
    url: string;
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url: string;
  image?: string;
  jobTitle: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  sameAs?: string[];
  description?: string;
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
}

export function generateArticleSchema(
  post: Post,
  url: string
): ArticleSchema {
  const baseUrl = 'https://jaredcunha.com';
  const imageUrl = post.ogImage
    ? `${baseUrl}${post.ogImage}`
    : post.coverImage
      ? `${baseUrl}${post.coverImage}`
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': post.type === 'blog' ? 'BlogPosting' : 'Article',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Jared Cunha',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Jared Cunha',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jared Cunha',
    url: 'https://jaredcunha.com',
    image: 'https://jaredcunha.com/images/_ui/me.png',
    jobTitle: 'Senior Director of Creative Technology',
    worksFor: {
      '@type': 'Organization',
      name: 'Coforma',
      url: 'https://coforma.io',
    },
    description:
      'Civic technologist and hybrid engineer/designer based in Washington, DC',
  };
}

export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jared Cunha',
    url: 'https://jaredcunha.com',
    description:
      'Blog posts and photo essays by Jared Cunha, a civic technologist and hybrid engineer/designer',
    author: {
      '@type': 'Person',
      name: 'Jared Cunha',
    },
  };
}
