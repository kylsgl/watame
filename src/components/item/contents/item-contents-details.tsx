import { type MantineColor, Group } from '@mantine/core';
import { IconStar } from '@tabler/icons-react';

import { Badge } from '@/components/common';

import styles from './item-contents-details.module.scss';

import type { ItemContents } from '../interfaces';

interface ItemContentsDetailsProps {
	children?: JSX.Element | JSX.Element[];
	details: Partial<ItemContents>;
	hideAltTitle?: boolean;
	hideGenres?: boolean;
}

export default function ItemContentsDetails({
	children,
	details: {
		altTitle = 'N/A',
		author = [],
		genre = [],
		rating = -1,
		status = 'N/A',
		title = 'N/A',
		year = 'N/A',
	},
	hideAltTitle = false,
	hideGenres = false,
}: ItemContentsDetailsProps): JSX.Element {
	const jsxTitle: JSX.Element = (
		<h1
			className={styles.title}
			style={{
				// fontSize: `clamp(1.05rem, 100vw, calc(2.2vmax - ${
				// 	title.length * 0.05
				// }rem))`,
				fontSize: `calc(1.5rem - ${
					title.length > 20 ? title.length * 0.06 : 0
				}px)`,
			}}
		>
			{title}
		</h1>
	);

	const jsxAltTitle: JSX.Element = (
		<h2
			className={styles.altTitle}
			style={{
				// fontSize: `clamp(0.925rem, 100vw, calc(1.6vmax - ${
				// 	title.length * 0.05
				// }rem))`,

				fontSize: `calc(1rem - ${
					altTitle.length > 20 ? altTitle.length * 0.04 : 0
				}px)`,
			}}
		>
			{altTitle}
		</h2>
	);

	const jsxAuthor: JSX.Element = (
		<span
			aria-label="Author"
			className={styles.author}
			style={{
				// fontSize: `clamp(0.925rem, 1vmax, calc(1vmax - ${
				// 	title.length * 0.05
				// }rem))`,

				fontSize: `calc(0.95rem - ${
					author.join(', ').length > 20 ? title.length * 0.01 : 0
				}px)`,
			}}
		>
			{author.join(', ')}
		</span>
	);

	const jsxRating: JSX.Element = (
		<Group
			align="center"
			aria-label="Rating"
			className={styles.rating}
			spacing={4}
		>
			<IconStar color="#FAB005" fill="#FAB005" size="1.125rem" stroke={1.5} />
			<span>{rating >= 0 ? rating.toFixed(1) : 'N/A'}</span>
		</Group>
	);

	const jsxPublication = (): JSX.Element => {
		const yearStr: string = !Number.isNaN(Number(year)) ? year : 'N/A';

		let color: MantineColor = 'gray';

		switch (status) {
			case 'Hiatus': {
				color = 'red';
				break;
			}
			case 'Ongoing': {
				color = 'green';
				break;
			}
			case 'Complete': {
				color = 'blue';
				break;
			}
			default: {
				break;
			}
		}

		return (
			<Badge
				className={styles.publication}
				color={color}
				size="md"
				variant="dot"
			>
				{`Publication: ${yearStr} | ${status}`}
			</Badge>
		);
	};

	const jsxGenres: JSX.Element = (
		<div role="presentation">
			{genre.map(
				(str: string): JSX.Element => (
					<Badge className={styles.badge} key={str} radius="sm" size="md">
						{str.toLowerCase()}
					</Badge>
				)
			)}
		</div>
	);

	return (
		<div className={styles.details}>
			<div>
				<div>
					{jsxTitle}
					{!hideAltTitle &&
					altTitle.toLowerCase() !== 'n/a' &&
					altTitle !== title
						? jsxAltTitle
						: null}
					{jsxAuthor}
				</div>

				<Group className={styles['rating-publication']} spacing={12}>
					{jsxRating}
					{jsxPublication()}
				</Group>

				{!hideGenres ? jsxGenres : null}
			</div>

			{children}
		</div>
	);
}
