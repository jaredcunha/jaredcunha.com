export interface BaseFrontmatter {
	type: 'blog' | 'photos';
	title: string;
	date: string;
	excerpt: string;
	slug: string;
	coverImage?: string;
	coverImageAltText?: string;
}

export interface BlogPost extends BaseFrontmatter {
	type: 'blog';
}

export interface PhotoPost extends BaseFrontmatter {
	type: 'photos';
}

export type Post = BlogPost | PhotoPost;

export interface MDXContent {
	frontmatter: Post;
	content: string;
}
