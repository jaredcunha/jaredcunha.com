'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import './SiteHeader.scss';
import { Logo } from '../SVGs/SVGs';
import { Bars, Times } from '../SVGs/SVGs';
import { AccessibleLink } from '../Link/Link';
import { FocusTrap } from 'focus-trap-react';
import useWindowDimensions from '@/app/utils/getWindowDimensions';

const navOpenClass = 'nav-open';

export function SiteHeader() {
	const openMenuButtonRef = useRef<HTMLButtonElement>(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const { width } = useWindowDimensions();
	const isWideScreen = width > 720;

	const navClassNames = `nav__flyout${
		menuVisible ? ' nav__flyout--is-open' : ''
	}`;

	const openNavMenu = () => {
		setMenuVisible(true);
	};

	const closeNavMenu = () => {
		setMenuVisible(false);
		setTimeout(() => {
			openMenuButtonRef.current?.focus();
		}, 100);
	};

	const escFunction = useCallback((event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeNavMenu();
		}
	}, []);

	useEffect(() => {
		// Prevents focus trapping when user expands window while mobile nav is open
		if (isWideScreen) setMenuVisible(false);
		const mainElement = document.getElementsByTagName('main')[0];
		const footerElement = document.getElementsByTagName('footer')[0];

		if (menuVisible) {
			document.body.classList.add(navOpenClass);
			mainElement.setAttribute('inert', '');
			footerElement.setAttribute('inert', '');
			document.addEventListener('keydown', escFunction);
		} else {
			document.body.classList.remove(navOpenClass);
			mainElement.removeAttribute('inert');
			footerElement.removeAttribute('inert');
			document.removeEventListener('keydown', escFunction);
		}

		console.log(menuVisible);

		// Cleanup event listener on unmount
		return () => {
			document.removeEventListener('keydown', escFunction);
		};
	}, [menuVisible, escFunction, isWideScreen]);

	return (
		<header className="site-header">
			<nav className="nav" aria-label="Main">
				<AccessibleLink
					href="/"
					className="nav__home-link"
					aria-label="Homepage"
				>
					<Logo />
				</AccessibleLink>
				{!menuVisible && (
					<button
						type="button"
						ref={openMenuButtonRef}
						className="nav__btn nav__btn--open"
						aria-label="open navigation menu"
						aria-controls="nav-flyout"
						onClick={openNavMenu}
						data-testid="open-nav-button"
					>
						<Bars />
					</button>
				)}
				<FocusTrap
					active={menuVisible}
					focusTrapOptions={{
						fallbackFocus: '#nav-flyout',
						initialFocus: '.nav__btn--close',
					}}
				>
					<div
						className={navClassNames}
						id="nav-flyout"
						data-testid="nav-flyout"
						tabIndex={-1}
					>
						<div className="nav_flyout-actions">
							<button
								type="button"
								className="nav__btn nav__btn--close"
								aria-label="Close navigation menu"
								onClick={closeNavMenu}
								data-testid="close-nav-button"
							>
								<Times />
							</button>
						</div>
						<ul className="nav__list">
							<li className="nav__item">
								<AccessibleLink
									href="/about"
									className="nav__link"
									onClick={() => setMenuVisible(false)}
								>
									About
								</AccessibleLink>
							</li>
							<li className="nav__item">
								<AccessibleLink
									href="/blog"
									className="nav__link"
									onClick={() => setMenuVisible(false)}
								>
									Blog
								</AccessibleLink>
							</li>
							<li className="nav__item">
								<AccessibleLink
									href="/photos"
									className="nav__link"
									onClick={() => setMenuVisible(false)}
								>
									Photos
								</AccessibleLink>
							</li>
							<li className="nav__item">
								<AccessibleLink
									href="/contact"
									className="nav__link"
									onClick={() => setMenuVisible(false)}
								>
									Contact
								</AccessibleLink>
							</li>
						</ul>
					</div>
				</FocusTrap>
			</nav>
		</header>
	);
}
