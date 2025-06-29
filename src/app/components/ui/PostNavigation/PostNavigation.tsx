import { AccessibleLink } from '../Link/Link';
import { ChevronLeft, ChevronRight } from '../SVGs/SVGs';
import './PostNavigation.scss';

interface PostNavigationProps {
  previous?: {
    title: string;
    slug: string;
  } | null;
  next?: {
    title: string;
    slug: string;
  } | null;
  type: 'blog' | 'photos';
}

export function PostNavigation({ previous, next, type }: PostNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className="post-navigation" aria-label="Previous and next posts">
      <div className="post-navigation__links">
        <div className="post-navigation__previous">
          {previous && (
            <AccessibleLink
              href={`/${type}/${previous.slug}`}
              className="post-navigation__link post-navigation__link--previous"
            >
              <span className="post-navigation__direction">
                <ChevronLeft /> Previous
              </span>
              <span className="post-navigation__title">{previous.title}</span>
            </AccessibleLink>
          )}
        </div>
        <div className="post-navigation__next">
          {next && (
            <AccessibleLink
              href={`/${type}/${next.slug}`}
              className="post-navigation__link post-navigation__link--next"
            >
              <span className="post-navigation__direction">
                Next <ChevronRight />
              </span>
              <span className="post-navigation__title">{next.title}</span>
            </AccessibleLink>
          )}
        </div>
      </div>
    </nav>
  );
}
