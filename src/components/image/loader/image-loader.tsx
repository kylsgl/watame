import {
	type PropsWithChildren,
	type ReactElement,
	Children,
	cloneElement,
	isValidElement,
	useEffect,
	useMemo,
	useRef,
} from 'react';
import { useSetAtom } from 'jotai';

import { type ImageLoaderStatusAtom, imageLoaderStatusAtom } from '@/store';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import styles from './image-loader.module.scss';

import { type ImageElementProps } from '../image-element';
import ImageLoaderPreloader from './image-loader-preloader';

interface ImageLoaderProps {
	className?: string;
	containerWrapper?: (elements: JSX.Element[]) => JSX.Element;
	firstIntersect?: boolean;
	imageElements: JSX.Element[];
	imageUrls: string[];
	imageWrapper?: (element: JSX.Element) => JSX.Element;
	onIntersect?: (index: number, element: HTMLImageElement) => void;
	onMount?: (element: HTMLDivElement | null) => void;
	preload?: number;
	rootMargin?: string;
	threshold?: number | number[];
}

export default function ImageLoader({
	className = '',
	containerWrapper,
	firstIntersect,
	imageElements,
	imageUrls,
	imageWrapper,
	onIntersect,
	onMount,
	preload,
	rootMargin,
	threshold,
}: ImageLoaderProps): JSX.Element {
	const setImageLoaderStatus = useSetAtom(imageLoaderStatusAtom);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect((): void => {
		if (onMount !== undefined) {
			onMount(containerRef.current);
		}
	}, [onMount]);

	const observerRefs = useIntersectionObserver<HTMLImageElement>(
		{
			root: null,
			rootMargin,
			threshold,
		},
		(element: HTMLImageElement): void => {
			const idx = Number(element.getAttribute('data-index'));

			setImageLoaderStatus(({ status }): ImageLoaderStatusAtom => {
				const newStatus: ImageLoaderStatusAtom = {
					activeIndex: idx,
					status,
				};

				const src: string | null = element.getAttribute('data-src');
				if (src !== null && !(src in status)) {
					newStatus.status[src] = undefined;
				}

				return newStatus;
			});

			if (onIntersect !== undefined) {
				onIntersect(idx, element);
			}
		},
		firstIntersect
	);

	const jsxImagesWithRefs: JSX.Element[] = useMemo(
		(): JSX.Element[] =>
			Children.map(imageElements, (child, index): JSX.Element | null => {
				if (!isValidElement(child)) {
					return null;
				}

				const jsxImageWithRef: JSX.Element = cloneElement(
					child as ReactElement<PropsWithChildren<ImageElementProps>>,
					{
						...(child.props as Partial<ImageElementProps>),
						index,
						imageRef: (element: HTMLImageElement | null): void => {
							observerRefs.current[index] = element;
						},
					}
				);

				return imageWrapper !== undefined
					? imageWrapper(jsxImageWithRef)
					: jsxImageWithRef;
			}),
		[imageElements, imageWrapper, observerRefs]
	);

	return (
		<>
			<div className={`${styles.container} ${className}`} ref={containerRef}>
				{containerWrapper !== undefined
					? containerWrapper(jsxImagesWithRefs)
					: jsxImagesWithRefs}
			</div>
			<ImageLoaderPreloader imageUrls={imageUrls} preload={preload} />
		</>
	);
}
