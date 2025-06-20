import { useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

interface WindowDimensions {
	width: number;
	height: number;
}

// Return default dimensions for SSR/build scenarios
function getWindowDimensions(): WindowDimensions {
	if (!isBrowser) {
		return { width: 800, height: 600 };
	}
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

export default function useWindowDimensions(): WindowDimensions {
	const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(
		getWindowDimensions()
	);

	useEffect(() => {
		if (!isBrowser) {
			return;
		}

		function handleResize(): void {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}
