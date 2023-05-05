import { type KeyboardEvent } from 'react';

import styles from './item-card.module.scss';

import ImageElement, { type ImageElementProps } from '../image/image-element';
import ImageLoaderItem from '../image/loader/image-loader-item';

interface ItemCardProps extends Omit<ImageElementProps, 'onClick'> {
	children?: JSX.Element | JSX.Element[] | string | null;
	details?: boolean;
	hideTitle?: boolean;
	imageUrl: string;
	itemUrl?: string;
	lazy?: boolean;
	title: string;
	onClick?: (url: string) => void;
}

// ! RENAME TO IMAGE CARD

export default function ItemCard({
	children,
	className = '',
	details = true,
	imageUrl,
	imageRef,
	itemUrl = '',
	index,
	lazy = true,
	loading = 'eager',
	style,
	title,
	onClick,
}: ItemCardProps): JSX.Element {
	const handleClick = (): void => {
		if (onClick !== undefined) {
			onClick(itemUrl);
		}
	};

	const handleKeyDown = ({ key }: KeyboardEvent<HTMLDivElement>): void => {
		if (key === 'Enter') {
			handleClick();
		}
	};

	return (
		<div
			className={`
				${styles.card}
				${onClick !== undefined ? styles.hover : ''}
				${className}
			`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role="button"
			style={style}
			tabIndex={0}
		>
			{details ? (
				<section className={styles['card-details']}>
					<div>
						<span
							style={{
								fontSize: `calc(0.95rem - ${
									title.length > 20 ? title.length * 0.02 : 0
								}px)`,
							}}
						>
							{title}
						</span>
						{children}
					</div>
				</section>
			) : null}

			{lazy ? (
				<ImageLoaderItem
					alt={`${title} cover`}
					index={index}
					imageRef={imageRef}
					skeletonClassName={styles.skeleton}
					src={imageUrl}
				/>
			) : (
				<ImageElement
					alt={`${title} cover`}
					index={index}
					loading={loading}
					src={imageUrl}
				/>
			)}
		</div>
	);
}
