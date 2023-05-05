import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Container } from '@mantine/core';

import { globalOptsAtom } from '@/store';
import { ImageLoader, ImageLoaderItem } from '@/components/image';
import { getCurrentPageNumber, movePage } from '@/lib/utils';

import styles from './reader-vertical.module.scss';

import ReaderVerticalNavigation from './reader-vertical-navigation';

interface ReaderVerticalProps {
	className?: string;
	imageUrls: string[];
	placeholder: string;
}

function handleIntersect(idx: number): void {
	movePage(idx + 1, true);
}

function handleMount(ref: HTMLDivElement | null): void {
	const imageIdx: number = getCurrentPageNumber() - 1;

	// * https://youtu.be/JuKX7MvQYcc
	requestAnimationFrame((): void => {
		ref?.children[imageIdx].scrollIntoView();
		setTimeout((): void => {
			requestAnimationFrame((): void => {
				ref?.children[imageIdx].scrollIntoView();
			});
		}, 200);
	});
}

export default function ReaderVertical({
	className = '',
	imageUrls,
	placeholder,
}: ReaderVerticalProps): JSX.Element {
	const { preloadPage } = useAtomValue(globalOptsAtom);

	const jsxImages: JSX.Element[] = useMemo(
		(): JSX.Element[] =>
			imageUrls.map((url, idx): JSX.Element => {
				const page: number = idx + 1;

				return (
					<ImageLoaderItem
						alt={`Page ${page}`}
						className={styles.page}
						id={`page=${page}`}
						key={url}
						placeholder={placeholder}
						skeleton={false}
						src={url}
					/>
				);
			}),
		[imageUrls, placeholder]
	);

	return (
		<Container className={className} fluid>
			<ImageLoader
				className={styles['reader-vertical']}
				firstIntersect
				imageElements={jsxImages}
				imageUrls={imageUrls}
				onIntersect={handleIntersect}
				onMount={handleMount}
				preload={preloadPage}
				rootMargin="-30px 0px -150px 0px"
				threshold={0}
			/>

			<ReaderVerticalNavigation className={styles['navigation-wrapper']} />
		</Container>
	);
}
