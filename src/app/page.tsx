import Image from 'next/image';
import { getPostsByType } from './utils/mdx';
import { BlogPost, PhotoPost } from './lib/defs';
import { AccessibleLink } from './components/ui/Link/Link';
import { PostsList } from './components/ui/PostsList/PostsList';
import './page.scss';

export default function Home() {
	const recentBlogPosts = getPostsByType<BlogPost>(
		'blog',
		(frontmatter, slug) => ({
			type: 'blog',
			title: frontmatter.title,
			date: frontmatter.date,
			slug: frontmatter.slug || slug,
			excerpt: frontmatter.excerpt,
			coverImage: frontmatter.coverImage,
			coverImageAltText: frontmatter.coverImageAltText,
		}),
		4
	);

	const recentPhotoPosts = getPostsByType<PhotoPost>(
		'photos',
		(frontmatter, slug) => ({
			type: 'photos',
			title: frontmatter.title,
			date: frontmatter.date,
			slug: frontmatter.slug || slug,
			excerpt: frontmatter.excerpt,
			coverImage: frontmatter.coverImage,
			coverImageAltText: frontmatter.coverImageAltText,
		}),
		4
	);

	return (
		<>
			<main>
				<div className="hero">
					<div>
						<h1 className="hero__heading">
							<span className="hero__heading__tagline">
								Hello, I’m Jared Cunha
							</span>
							{}I make technology for the public good
						</h1>
						<p className="hero__intro">
							Senior Director of Creative Technology at{' '}
							<strong>
								<a href="https://coforma.io">Coforma</a>
							</strong>{' '}
							an accessibility-minded engineer and designer living in
							Washington, DC
						</p>
					</div>
					<div className="hero__feature">
						<Image
							src="/images/_ui/me.png"
							alt=""
							className="hero__img"
							width={400}
							height={400}
						/>
					</div>
				</div>

				<section className="recent-posts">
					<h2 className="recent-posts__heading">Blog Posts</h2>
					<PostsList headingLevel={3} posts={recentBlogPosts} variant="grid" />
					<p className="recent-posts__more">
						<AccessibleLink href="/blog">More blog posts →</AccessibleLink>
					</p>
				</section>
				<section className="recent-posts">
					<h2 className="recent-posts__heading">Photo Essays</h2>
					<PostsList
						headingLevel={3}
						posts={recentPhotoPosts}
						variant="grid-wide"
					/>
					<p className="recent-posts__more">
						<AccessibleLink href="/photos">More photo essays →</AccessibleLink>
					</p>
				</section>
			</main>
		</>
	);
}
