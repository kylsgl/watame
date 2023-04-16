import { type ImgHTMLAttributes } from 'react';

export interface ImageElementProps extends ImgHTMLAttributes<HTMLImageElement> {
	'data-src'?: string;
	index?: number;
	imageRef?: (element: HTMLImageElement) => void;
}

/* eslint-disable @next/next/no-img-element */
export default function ImageElement({
	alt,
	className,
	'data-src': dataSrc,
	id,
	index,
	imageRef,
	loading = 'lazy',
	placeholder,
	src,
	style,
	onClick,
}: ImageElementProps): JSX.Element {
	return (
		<img
			alt={alt}
			className={className}
			data-index={index}
			data-src={dataSrc}
			decoding="async"
			draggable="false"
			id={id}
			loading={loading}
			onClick={onClick}
			placeholder={placeholder}
			ref={imageRef}
			referrerPolicy="no-referrer"
			src={src}
			style={{
				...style,
				cursor: onClick != null ? 'pointer' : undefined,
			}}
			// crossOrigin="anonymous"
		/>
	);
}
