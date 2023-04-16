import { useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useAtomValue } from 'jotai';

import { globalOptsAtom } from '@/store';
import { useSmoothScroll } from '@/hooks';

import ImagePlaceholder from '../icons/image-placeholder';

import ReaderHorizontal from './horizontal/reader-horizontal';
import ReaderVertical from './vertical/reader-vertical';

interface ReaderLayoutProps {
	className?: string;
	imageUrls: string[];
}

export default function ReaderLayout({
	className = '',
	imageUrls,
}: ReaderLayoutProps): JSX.Element {
	const { colorScheme, readerLayout, scrollFrameRate, scrollSpeed } =
		useAtomValue(globalOptsAtom);

	useSmoothScroll(
		{ Up: 'ArrowUp', Down: 'ArrowDown' },
		Math.round((scrollSpeed / 2) * 1),
		scrollFrameRate
	);

	const layoutProps = useMemo(() => {
		const placeholder = `data:image/svg+xml,${encodeURIComponent(
			renderToStaticMarkup(
				<ImagePlaceholder
					fill={`${colorScheme === 'dark' ? '#fcc2d7' : '#e64980'}`}
				/>
			)
		)}`;

		return {
			className,
			imageUrls,
			placeholder,
		};
	}, [className, colorScheme, imageUrls]);

	return readerLayout === 'horizontal' ? (
		<ReaderHorizontal {...layoutProps} />
	) : (
		<ReaderVertical {...layoutProps} />
	);
}
