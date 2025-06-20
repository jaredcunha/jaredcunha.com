'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface AccessibleLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	'aria-label'?: string;
	[key: string]: unknown;
}

export function AccessibleLink({
	href,
	children,
	className,
	'aria-label': ariaLabel,
	...props
}: AccessibleLinkProps) {
	const pathname = usePathname();
	const previousPathnameRef = useRef(pathname);

	useEffect(() => {
		// If pathname changed, focus on h1
		if (previousPathnameRef.current !== pathname) {
			setTimeout(() => {
				const h1 = document.querySelector('h1');
				if (h1) {
					h1.setAttribute('tabindex', '-1');
					h1.focus();
					// Remove tabindex after focus to prevent future tab stops
					h1.addEventListener(
						'blur',
						() => {
							h1.removeAttribute('tabindex');
						},
						{ once: true }
					);
				}
			}, 100);
		}
		previousPathnameRef.current = pathname;
	}, [pathname]);

	return (
		<NextLink
			href={href}
			className={className}
			aria-label={ariaLabel}
			{...props}
		>
			{children}
		</NextLink>
	);
}
