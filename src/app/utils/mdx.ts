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
	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith('.mdx'))
		.map((file) => file.replace(/\.mdx$/, ''));
}

export function getMdxBySlug(contentType: 'blog' | 'photos', slug: string) {
	const filePath = path.join(
		process.cwd(),
		'src/content',
		contentType,
		`${slug}.mdx`
	);
	const source = fs.readFileSync(filePath, 'utf8');

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
