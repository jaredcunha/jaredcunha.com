import { AccessibleLink } from '../Link/Link';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__wrapper">
        <div className="footer__col">
          <h2 className="footer__heading">Elsewhere</h2>
          <nav aria-label="Social Media">
            <ul className="footer__nav-list">
              <li>
                <a
                  href="https://bsky.app/profile/jaredcunha.bsky.social"
                  rel="me"
                >
                  Bluesky
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/jaredcunha/" rel="me">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/jaredcunha" rel="me">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://glass.photo/jared-cunha" rel="me">
                  Glass
                </a>
              </li>
              <li>
                <a href="https://instagram.com/jaredcunha" rel="me">
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__col">
          <h2 className="footer__heading">Site info</h2>
          <nav aria-label="Site info">
            <ul className="footer__nav-list">
              <li>
                <AccessibleLink href="/blog/i-am-not-tracking-you">
                  No tracking
                </AccessibleLink>
              </li>
              <li>
                <AccessibleLink href="/ai-usage">AI usage</AccessibleLink>
              </li>
              <li>
                <a href="/rss.xml">RSS feed</a>
              </li>
              <li>
                © Jared Cunha <strong>{new Date().getFullYear()}</strong>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
