import { useMemo, useState, useTransition } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { type Swiper, HashNavigation, Keyboard } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';

import {
	globalOptsAtom,
	horizontalReaderOptsAtom,
	openedTitleCurrentPageAtom,
} from '@/store';
import { ImageLoader, ImageLoaderItem } from '@/components/image';
import { getCurrentPageNumber, moveChapter } from '@/lib/utils';

import styles from './reader-horizontal.module.scss';

import ReaderHorizontalNavigation from './reader-horizontal-navigation';

interface ReaderHorizontalProps {
	className?: string;
	imageUrls: string[];
	placeholder: string;
}

export default function ReaderHorizontal({
	className = '',
	imageUrls,
	placeholder,
}: ReaderHorizontalProps): JSX.Element {
	const setOpenedTitleCurrentPage = useSetAtom(openedTitleCurrentPageAtom);

	const globalOpts = useAtomValue(globalOptsAtom);
	const horizontalReaderOpts = useAtomValue(horizontalReaderOptsAtom);

	const [loadNext, setLoadNext] = useState<boolean>(true);

	const [, slideStartTransition] = useTransition();

	const handleAfterInit = ({ activeIndex, el }: Swiper): void => {
		setLoadNext(true);
		el.firstElementChild?.children[activeIndex]?.scrollIntoView();
	};

	const handleKeyPress = (
		{ isBeginning, isEnd }: Swiper,
		keyCode: string
	): void => {
		if (!loadNext) {
			return;
		}

		switch (Number(keyCode)) {
			case 37: {
				if (isEnd && horizontalReaderOpts.direction === 'rtl') {
					setLoadNext(false);
					moveChapter('next');
					return;
				}

				if (isBeginning) {
					setLoadNext(false);
					moveChapter('prev', 'last');
				}
				break;
			}
			case 39: {
				if (isBeginning && horizontalReaderOpts.direction === 'rtl') {
					setLoadNext(false);
					moveChapter('prev', 'last');
					return;
				}

				if (isEnd) {
					setLoadNext(false);
					moveChapter('next');
				}
				break;
			}
			default:
				break;
		}
	};

	const handleSlideChangeTransitionEnd = (swiper: Swiper): void => {
		window.scroll(0, 0);

		requestAnimationFrame((): void => {
			(swiper.el as HTMLElement | null)?.firstElementChild?.children[
				swiper.activeIndex
			]?.scrollIntoView();
		});

		slideStartTransition((): void => {
			setLoadNext(swiper.isBeginning || swiper.isEnd);
			setOpenedTitleCurrentPage(getCurrentPageNumber());
		});
	};

	const jsxSlider = (elements: JSX.Element[]): JSX.Element => (
		<SwiperComponent
			autoHeight
			className="reader-horizontal"
			dir={horizontalReaderOpts.direction}
			direction="horizontal"
			hashNavigation={{
				watchState: true,
			}}
			initialSlide={0}
			key={`${imageUrls[0]}-${horizontalReaderOpts.direction}`}
			keyboard={{
				enabled: true,
				onlyInViewport: false,
				pageUpDown: false,
			}}
			maxBackfaceHiddenSlides={0}
			modules={[HashNavigation, Keyboard]}
			onAfterInit={handleAfterInit}
			onKeyPress={handleKeyPress}
			onSlideChangeTransitionEnd={handleSlideChangeTransitionEnd}
			passiveListeners
			preventInteractionOnTransition
			slidesPerGroup={horizontalReaderOpts.pages}
			slidesPerView={horizontalReaderOpts.pages}
			spaceBetween={0} // 3 // 5
			speed={0}
			updateOnWindowResize
			zoom
		>
			{horizontalReaderOpts.pages > 1 && horizontalReaderOpts.offset && (
				<SwiperSlide className={styles['offset-slide']} data-hash="page=1" />
			)}

			{elements}

			<ReaderHorizontalNavigation
				isLTR={horizontalReaderOpts.direction === 'ltr'}
				pages={horizontalReaderOpts.pages}
			/>
		</SwiperComponent>
	);

	const jsxSlide = (element: JSX.Element): JSX.Element => {
		const idx: number = imageUrls.indexOf(element.key?.toString() ?? '');

		return (
			<SwiperSlide
				className={`${
					horizontalReaderOpts.pages <= 2 &&
					idx !== 0 &&
					idx !== imageUrls.length - 1
						? 'hidden'
						: ''
				}`}
				data-hash={`page=${idx + 1}`}
				key={element.key}
			>
				{element}
			</SwiperSlide>
		);
	};

	const jsxImages: JSX.Element[] = useMemo(
		(): JSX.Element[] =>
			imageUrls.map(
				(url, idx): JSX.Element => (
					<ImageLoaderItem
						alt={`Page ${idx + 1}`}
						className={styles.image}
						key={url}
						placeholder={placeholder}
						skeleton={false}
						src={url}
					/>
				)
			),
		[imageUrls, placeholder]
	);

	return (
		<ImageLoader
			className={`${styles.container} ${
				horizontalReaderOpts.alignCenter ? styles['align-center'] : ''
			} ${className}`}
			containerWrapper={jsxSlider}
			firstIntersect
			imageElements={jsxImages}
			imageUrls={imageUrls}
			imageWrapper={jsxSlide}
			preload={
				horizontalReaderOpts.pages > 1 &&
				horizontalReaderOpts.pages > globalOpts.preloadPage
					? horizontalReaderOpts.pages
					: globalOpts.preloadPage
			}
			threshold={0.05}
		/>
	);
}
