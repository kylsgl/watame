import { Fragment } from 'react';
import { Skeleton } from '@mantine/core';

import styles from './item-contents.module.scss';

import type { ItemContents as IItemContents } from '../interfaces';

import ItemContentsChapters from './item-contents-chapters';
import ItemContentsDescription from './item-contents-description';
import ItemContentsDetailsControls from './item-contents-details-controls';
import ItemCard from '../item-card';
import ItemContentsDetails from './item-contents-details';

interface ItemContentsProps {
	details: Partial<IItemContents>;
	isReady: boolean;
	itemUrl: string;
}

export default function ItemContents({
	details: {
		altTitle = 'N/A',
		author = [],
		chapters = [],
		description = 'N/A',
		genre = [],
		image = 'N/A',
		rating = -1,
		status = 'N/A',
		title = 'N/A',
		year = 'N/A',
	},
	isReady,
	itemUrl,
}: ItemContentsProps): JSX.Element {
	const details: IItemContents = {
		altTitle,
		author,
		chapters,
		description,
		genre,
		image,
		rating,
		status,
		title,
		year,
	};

	const loadingStyle: string = !isReady ? styles.loading : '';

	const jsxDetailsPanel = (
		<div className={styles.details}>
			<Skeleton
				className={`${styles['left-panel']} ${styles.cover}`}
				visible={!isReady}
			>
				{details.image.length > 3 ? (
					<ItemCard
						details={false}
						hideTitle
						imageUrl={details.image}
						lazy={false}
						title={details.title}
					/>
				) : null}
			</Skeleton>

			<Skeleton className={styles['right-panel']} visible={!isReady}>
				<ItemContentsDetails details={details}>
					<ItemContentsDetailsControls details={details} itemUrl={itemUrl} />
				</ItemContentsDetails>
			</Skeleton>
		</div>
	);

	const jsxDescription: JSX.Element = (
		<Skeleton
			className={`${styles.description} ${loadingStyle}`}
			visible={!isReady}
		>
			{description.length >= 5 ? (
				<ItemContentsDescription
					className={styles.description}
					maxHeight={50}
					minHeight={93.83}
				>
					{description}
				</ItemContentsDescription>
			) : null}
		</Skeleton>
	);

	const jsxChapters: JSX.Element = (
		<Skeleton
			className={`${styles.chapters} ${loadingStyle}`}
			visible={!isReady}
		>
			<ItemContentsChapters
				chapters={chapters}
				sort={{ label: 'Chapter', date: 'Added' }}
			/>
		</Skeleton>
	);

	return (
		<>
			{jsxDetailsPanel}
			{jsxDescription}
			{jsxChapters}
		</>
	);
}
