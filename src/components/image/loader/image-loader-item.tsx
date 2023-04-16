import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Skeleton } from '@mantine/core';

import {
	type ImageLoaderStatusAtom,
	type ImageStatus,
	imageLoaderStatusAtom,
	imageUrlCacheBaseAtom,
} from '@/store';

import ImageElement, { type ImageElementProps } from '../image-element';
import ImageError from '../image-error';

interface ImageLoaderItemProps extends ImageElementProps {
	placeholder?: string;
	showError?: boolean;
	skeleton?: boolean;
	skeletonClassName?: string;
	src: string;
	onClick?: () => void;
}

export default function ImageLoaderItem({
	alt,
	className = '',
	id,
	index,
	imageRef,
	onClick,
	placeholder,
	showError = true,
	skeleton = true,
	skeletonClassName,
	src,
}: ImageLoaderItemProps): JSX.Element {
	const [{ status }, setImageLoaderStatus] = useAtom(imageLoaderStatusAtom);

	const imageUrlCache = useAtomValue(imageUrlCacheBaseAtom);

	const imageStatus: ImageStatus = useMemo((): ImageStatus => {
		const isCached: boolean = imageUrlCache.get(src) != null;

		if (status[src] === 'ok' && !isCached) {
			imageUrlCache.add(src);
		}

		return isCached ? 'ok' : status[src];
	}, [src, status, imageUrlCache]);

	const jsxImage: JSX.Element = (
		<ImageElement
			alt={alt}
			className={className}
			data-src={imageStatus !== 'ok' ? src : undefined}
			id={id}
			index={index}
			imageRef={imageRef}
			loading="eager"
			onClick={imageStatus === 'ok' ? onClick : undefined}
			src={imageStatus === 'ok' ? src : placeholder}
		/>
	);

	if (showError && imageStatus === 'error') {
		const handleErrorClick = (): void => {
			setImageLoaderStatus(
				(current): ImageLoaderStatusAtom => ({
					activeIndex: current.activeIndex,
					status: {
						...current.status,
						[src]: 'refetch',
					},
				})
			);
		};

		return <ImageError id={id} onClick={handleErrorClick} url={src} />;
	}

	return skeleton ? (
		<Skeleton
			animate
			className={imageStatus !== 'ok' ? skeletonClassName : undefined}
			visible={imageStatus !== 'ok'}
		>
			{jsxImage}
		</Skeleton>
	) : (
		jsxImage
	);
}
