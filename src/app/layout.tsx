import type { Metadata } from 'next';
import { Raleway, Noto_Serif } from 'next/font/google';
import './styles/globals.scss';
import BodyClassProvider from './components/BodyClassProvider';
import { SiteHeader } from './components/ui/SiteHeader/SiteHeader';
import { Footer } from './components/ui/Footer/Footer';

const raleway = Raleway({
	variable: '--font-raleway',
	subsets: ['latin'],
});

const notoSerif = Noto_Serif({
	variable: '--font-noto-serif',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Jared Cunha',
	description:
		'Jared Cunha is a civic technologist and hybrid engineer/designer based in Washington, DC',
	icons: {
		icon: [
			{
				url: '/favicon.svg',
				type: 'image/svg+xml',
			},
			{
				url: '/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
		],
		apple: [
			{
				url: '/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
		],
		other: [
			{
				rel: 'icon',
				url: '/icons/icon-48x48.png',
				sizes: '48x48',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icons/icon-72x72.png',
				sizes: '72x72',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icons/icon-96x96.png',
				sizes: '96x96',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icons/icon-144x144.png',
				sizes: '144x144',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icons/icon-256x256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icons/icon-384x384.png',
				sizes: '384x384',
				type: 'image/png',
			},
			{
				rel: 'icon',
				url: '/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${notoSerif.variable} ${raleway.variable}`}
				suppressHydrationWarning
			>
				<BodyClassProvider />
				<SiteHeader />
				{children}
				<Footer />
			</body>
		</html>
	);
}
