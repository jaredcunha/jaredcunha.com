import Image from 'next/image';
import { AccessibleLink } from '../Link/Link';
import { BlogPost, PhotoPost } from '@/app/lib/defs';
import Date from '../../Date';
import './PostsList.scss';

interface PostsListProps {
	posts: BlogPost[] | PhotoPost[];
	variant?: 'grid' | 'grid-med' | 'grid-wide' | 'column';
	headingLevel: 2 | 3;
}

export function PostsList({
	posts,
	variant,
	headingLevel = 3,
}: PostsListProps) {
	const variantClass = variant ? `posts-list--${variant}` : '';
	const HeadingTag = `h${headingLevel}` as const;

	return (
		<ul className={`posts-list ${variantClass}`.trim()}>
			{posts.map((post) => {
				const isPhotoPost = post.type === 'photos';
				const linkPath = `/${post.type}/${post.slug}`;

				return (
					<li key={post.slug} className="posts-list__item">
						{isPhotoPost && post.coverImage && (
							<AccessibleLink
								href={linkPath}
								className="posts-list__photo-link"
								tabIndex={-1}
								aria-hidden="true"
							>
								<Image
									src={post.coverImage}
									alt={post.coverImageAltText || ''}
									width={900}
									height={600}
									className="cover-image"
								/>
							</AccessibleLink>
						)}
						<HeadingTag className="posts-list__heading">
							<AccessibleLink href={linkPath} className="posts-list__link">
								{post.title}
							</AccessibleLink>
						</HeadingTag>
						<p className="posts-list__date">
							<Date dateString={post.date} />
						</p>
						{post.excerpt && (
							<p className="posts-list__excerpt">{post.excerpt}</p>
						)}
					</li>
				);
			})}
		</ul>
	);
}
