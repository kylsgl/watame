import { type ImgHTMLAttributes, type KeyboardEvent } from 'react';

export interface ImageElementProps extends ImgHTMLAttributes<HTMLImageElement> {
	'data-src'?: string;
	index?: number;
	imageRef?: (element: HTMLImageElement) => void;
	onClick?: () => void;
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
	const handleKeyDown = ({ key }: KeyboardEvent<HTMLImageElement>): void => {
		if (key === 'Enter' && onClick !== undefined) {
			onClick();
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
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
			onKeyDown={handleKeyDown}
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
