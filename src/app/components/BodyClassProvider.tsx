'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyClassProvider() {
	const pathname = usePathname();

	useEffect(() => {
		const body = document.body;
		body.classList.remove('post-page');
		const isPostPage =
			pathname.startsWith('/blog/') || pathname.startsWith('/photos/');

		// Remove existing route classes

		// Add classes based on current route
		if (isPostPage) {
			body.classList.add('post-page');
		}

		console.log('Current pathname:', pathname);
	}, [pathname]);

	return null; // This component doesn't render anything
}
