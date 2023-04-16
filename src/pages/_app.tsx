'use client';

import { Fragment, memo } from 'react';
import { type AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'swiper/scss';
import 'swiper/scss/pagination';

import '@/styles/globals.scss';
import Theme from '@/components/layout/theme';

const LayoutNoSSR = memo(
	dynamic(async () => import('@/components/layout/layout'), {
		ssr: false,
	})
);

const queryClient = new QueryClient();

const font = undefined;

export default function App({ Component }: AppProps): JSX.Element {
	return (
		<Fragment>
			<Head>
				<meta name="application-name" content="Watame App" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Watame App" />
				<meta name="description" content="Watame Manga Reader" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#1b1b1d" />
				<meta name="msapplication-tap-highlight" content="no" />
				<meta name="theme-color" content="#1b1b1d" />

				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>

				<title>Watame</title>

				<link rel="shortcut icon" href="/favicon.ico" />

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/icons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/icons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/icons/favicon-16x16.png"
				/>
				<link
					rel="mask-icon"
					href="/icons/safari-pinned-tab.svg"
					color="#fcc2d7"
				/>
				{/* <link rel="shortcut icon" href="/icons/favicon.ico" /> */}

				<link rel="manifest" href="/manifest.json" />
			</Head>

			<QueryClientProvider client={queryClient}>
				<Theme font={font}>
					<LayoutNoSSR>
						<Component />
					</LayoutNoSSR>
				</Theme>
			</QueryClientProvider>
		</Fragment>
	);
}
