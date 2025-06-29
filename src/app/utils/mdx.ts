import fs from 'fs';
import path from 'path';
import { BaseFrontmatter } from '@/app/lib/defs';

function parseSimpleYaml(yamlStr: string): Record<string, string> {
  const lines = yamlStr.split('\n');
  const obj: Record<string, string> = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      let value = rest.join(':').trim();
      // Remove surrounding single or double quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      obj[key.trim()] = value;
    }
  }
  return obj;
}

export function getMdxSlugs(contentType: 'blog' | 'photos'): string[] {
  const dir = path.join(process.cwd(), 'src/content', contentType);
  const slugs: string[] = [];

  // Check if directory exists
  if (!fs.existsSync(dir)) {
    return slugs;
  }

  // Get all items in the content directory
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile() && item.endsWith('.mdx')) {
      // Direct MDX file in the content directory (legacy)
      slugs.push(item.replace(/\.mdx$/, ''));
    } else if (stat.isDirectory() && /^\d{4}$/.test(item)) {
      // Year directory (e.g., 2024, 2025)
      const yearDir = itemPath;
      const yearFiles = fs.readdirSync(yearDir);

      for (const yearFile of yearFiles) {
        if (yearFile.endsWith('.mdx')) {
          slugs.push(yearFile.replace(/\.mdx$/, ''));
        }
      }
    }
  }

  return slugs;
}

export function getMdxBySlug(contentType: 'blog' | 'photos', slug: string) {
  const baseDir = path.join(process.cwd(), 'src/content', contentType);

  // First try to find the file in the root directory (legacy)
  const legacyFilePath = path.join(baseDir, `${slug}.mdx`);
  if (fs.existsSync(legacyFilePath)) {
    const source = fs.readFileSync(legacyFilePath, 'utf8');
    return parseMdxContent(source);
  }

  // Then search in year directories
  const items = fs.readdirSync(baseDir);
  for (const item of items) {
    const itemPath = path.join(baseDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && /^\d{4}$/.test(item)) {
      const yearFilePath = path.join(itemPath, `${slug}.mdx`);
      if (fs.existsSync(yearFilePath)) {
        const source = fs.readFileSync(yearFilePath, 'utf8');
        return parseMdxContent(source);
      }
    }
  }

  throw new Error(`MDX file not found for slug: ${slug}`);
}

function parseMdxContent(source: string) {
  // Extract frontmatter
  const match = /^---\n([\s\S]+?)\n---\n?([\s\S]*)$/m.exec(source);
  let frontmatter = {};
  let content = source;
  if (match) {
    frontmatter = parseSimpleYaml(match[1]);
    content = match[2];
  }
  return { frontmatter, content };
}

export function getPostsByType<T extends BaseFrontmatter>(
  type: 'blog' | 'photos',
  mapFrontmatter: (frontmatter: Record<string, string>, slug: string) => T,
  count?: number
): T[] {
  const slugs = getMdxSlugs(type);
  const posts: T[] = slugs.map((slug) => {
    const { frontmatter } = getMdxBySlug(type, slug);
    return mapFrontmatter(frontmatter, slug);
  });

  // Sort by date descending
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  // Return limited number of posts if count is specified
  return count ? posts.slice(0, count) : posts;
}

export function getAdjacentPosts<T extends BaseFrontmatter>(
  type: 'blog' | 'photos',
  currentSlug: string,
  mapFrontmatter: (frontmatter: Record<string, string>, slug: string) => T
): { previous: T | null; next: T | null } {
  const allPosts = getPostsByType(type, mapFrontmatter);
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    next: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    previous:
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}
