import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Grid, Progress } from '@mantine/core';

import {
	type LibraryEntry,
	globalOpenedModalAtom,
	searchOpenedUrlAtom,
	bookmarksAtom,
	historyAtom,
} from '@/store';

import { ItemCard } from '@/components/item';

import styles from './library-contents.module.scss';

import LibraryFilter from './library-filter';

type TabLabels = 'library' | 'history';

function ProgressDetails(
	chapterPage: number,
	chapterPages: number
): JSX.Element {
	const percentage: number = (100 * chapterPage) / chapterPages;

	return (
		<div className={styles.progress}>
			<div className={styles['progress-text']}>
				<span>Progress</span>
				<span>{`${chapterPage} / ${chapterPages}`}</span>
			</div>
			<Progress aria-label={`${percentage}% complete`} value={percentage} />
		</div>
	);
}

export default function LibraryContents(): JSX.Element {
	const bookmarks = Object.values(useAtomValue(bookmarksAtom));

	const history = useAtomValue(historyAtom);

	const setSearchOpenedUrl = useSetAtom(searchOpenedUrlAtom);
	const setGlobalOpenedModal = useSetAtom(globalOpenedModalAtom);

	const [tab, setTab] = useState<TabLabels>('library');

	const handleItemClick = (url: string): void => {
		setSearchOpenedUrl(url);
		setGlobalOpenedModal((current) => (current !== 'Item' ? 'Item' : 'None'));
	};

	const itemWrapper = ({
		chapterIndex,
		chaptersCount,
		imageUrl,
		itemUrl,
		title,
	}: LibraryEntry): JSX.Element => (
		<Grid.Col key={itemUrl} span={'content'}>
			<ItemCard
				className={styles.card}
				imageUrl={imageUrl}
				itemUrl={itemUrl}
				lazy={false}
				onClick={handleItemClick}
				title={title}
			>
				{ProgressDetails(chapterIndex + 1, chaptersCount)}
			</ItemCard>
		</Grid.Col>
	);

	const itemsWrapper = (
		element: Array<JSX.Element | JSX.Element[] | null | undefined>
	): JSX.Element => (
		<Grid align="flex-end" className={styles.grid} gutter="sm" justify="center">
			{element}
		</Grid>
	);

	const jsxTabs = (
		items: Array<[label: TabLabels, count: number]>
	): JSX.Element => (
		<div className={styles.tabs}>
			{items.map(([label, count]): JSX.Element => {
				const handleTabClick = (): void => {
					setTab(label);
				};

				return (
					<div
						className={`${styles.tab} ${tab === label ? styles.active : ''}`}
						key={label}
						onClick={handleTabClick}
					>
						<h1 className={styles.title}>{label}</h1>
						<h1 className={styles.count}>{count}</h1>
					</div>
				);
			})}
		</div>
	);

	return (
		<div>
			{jsxTabs([
				['library', bookmarks.length],
				['history', history.length],
			])}
			<LibraryFilter
				entries={tab === 'library' ? bookmarks : history}
				itemWrapper={itemWrapper}
				itemsWrapper={itemsWrapper}
			/>
		</div>
	);
}
