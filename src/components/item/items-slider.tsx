import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ImageLoader } from '@/components/image';

import styles from './items-slider.module.scss';

function containerWrapper(elements: JSX.Element[]): JSX.Element {
	return (
		<Swiper
			breakpoints={{
				580: {
					slidesPerGroup: 3,
				},
				760: {
					slidesPerGroup: 4,
				},
				940: {
					slidesPerGroup: 5,
				},
				1120: {
					slidesPerGroup: 6,
				},
				1300: {
					slidesPerGroup: 7,
				},
				1480: {
					slidesPerGroup: 8,
				},
			}}
			centerInsufficientSlides
			className="items-swiper"
			initialSlide={0}
			maxBackfaceHiddenSlides={0}
			modules={[Pagination]}
			pagination={{
				clickable: true,
				renderBullet(index: number, className: string): string {
					return `<span aria-label="Page ${index + 1}" class="${className}">${
						index + 1
					}</span>`;
				},
			}}
			passiveListeners
			resizeObserver
			slidesPerGroup={2}
			slidesPerView="auto"
			spaceBetween={10}
			updateOnWindowResize
		>
			{elements}
		</Swiper>
	);
}

function imageWrapper(element: JSX.Element): JSX.Element {
	return <SwiperSlide key={element.key}>{element}</SwiperSlide>;
}

interface ItemsSliderProps {
	items: JSX.Element[];
	imageUrls: string[];
}

export default function ItemSlide({
	items,
	imageUrls,
}: ItemsSliderProps): JSX.Element | null {
	return (
		<ImageLoader
			className={styles.slider}
			containerWrapper={containerWrapper}
			imageElements={items}
			imageUrls={imageUrls}
			imageWrapper={imageWrapper}
			preload={0}
			threshold={0}
		/>
	);
}
