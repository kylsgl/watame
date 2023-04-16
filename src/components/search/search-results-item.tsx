import { Fragment, useEffect, useState } from 'react';
import { type UseQueryResult } from '@tanstack/react-query';
import { Grid } from '@mantine/core';

import { ItemsCard } from '@/components/common';
import { ItemCard, ItemSlider } from '@/components/item';
import { MAX_SEARCH_RESULT_ITEMS } from '@/constants';

import styles from './search-results-item.module.scss';

import type { SearchResult, SourceSearchResults } from './interfaces';

interface SearchResultsItemProps {
	item: UseQueryResult<SourceSearchResults>;
	onClick: (url: string) => void;
}

export default function SearchResultsItem({
	item: { fetchStatus, data },
	onClick,
}: SearchResultsItemProps): JSX.Element {
	const [resultStatus, setResultStatus] = useState<
		'success' | 'loading' | 'empty'
	>('loading');

	useEffect(() => {
		if (fetchStatus === 'fetching' || data === undefined) {
			return undefined;
		}

		const [, results] = data;

		if (results.length <= 0) {
			setResultStatus('empty');
			return undefined;
		}

		const s = setTimeout(() => {
			setResultStatus('success');
		}, 400);

		return (): void => {
			clearTimeout(s);
		};
	}, [data, fetchStatus]);

	const jsxContents = (): JSX.Element | null => {
		if (data === undefined) {
			return null;
		}

		const [source, results] = data;

		// Limit results to 20 items
		if (results.length > MAX_SEARCH_RESULT_ITEMS) {
			results.length = MAX_SEARCH_RESULT_ITEMS;
		}

		const jsxSlider: JSX.Element = (
			<ItemSlider
				items={results.map(
					({ image, title, url }): JSX.Element =>
						image != null ? (
							<ItemCard
								imageUrl={image}
								itemUrl={url}
								key={url}
								onClick={onClick}
								title={title}
							/>
						) : (
							<></>
						)
				)}
				imageUrls={results.map(
					({ image }: SearchResult): string => image ?? ''
				)}
			/>
		);

		return (
			<Fragment>
				<div className={styles.header}>
					<h1 className={styles.title}>{source}</h1>
					<h1 className={styles.subtitle}>{results.length}</h1>
				</div>
				{results.length > 0 ? jsxSlider : null}
			</Fragment>
		);
	};

	return (
		<Grid.Col className={styles.grid}>
			<ItemsCard
				className={`${styles.card} ${
					resultStatus === 'loading' || resultStatus === 'empty'
						? styles.shrink
						: ''
				}`}
				isLoading={resultStatus === 'loading'}
			>
				{resultStatus !== 'loading' ? jsxContents() : null}
			</ItemsCard>
		</Grid.Col>
	);
}
