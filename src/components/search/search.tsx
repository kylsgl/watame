import { type TransitionEvent, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Anchor, Container, Grid, Title } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import { globalOpenedModalAtom, searchQueryAtom } from '@/store';
import { useSearchResultQuery } from '@/hooks';

import styles from './search.module.scss';

import SearchBar from './search-bar';
import SearchResults from './search-results';

export default function Search(): JSX.Element {
	const setGlobalOpenedModal = useSetAtom(globalOpenedModalAtom);

	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

	const [finishedAnimating, setFinishedAnimating] = useState<boolean>(
		searchQuery.length > 0
	);

	const results = useSearchResultQuery(searchQuery.toLowerCase());

	const centeredStyle = searchQuery.length <= 0 ? styles.centered : '';

	const handleConfigureClick = (): void => {
		setGlobalOpenedModal('Settings');
	};

	const handleTransitionEnd = (
		ev: TransitionEvent<HTMLDivElement> | undefined
	): void => {
		if (searchQuery.length <= 0) {
			// TODO: ADD DEBOUNCE
			setFinishedAnimating(false);
		} else if (ev?.propertyName === 'width' && searchQuery.length > 0) {
			setFinishedAnimating(true);
		}
	};

	return (
		<Container
			className={styles.container}
			onTransitionEnd={handleTransitionEnd}
			size={1496}
		>
			<div className={`${styles['title-container']} ${centeredStyle}`}>
				<Title className={`${styles.title}`} order={2}>
					what can it be now?
				</Title>

				<Anchor className={styles.configure} onClick={handleConfigureClick}>
					<IconSettings size={18} stroke={1.5} />
					Configure Sources
				</Anchor>
			</div>

			<SearchBar
				className={`${styles.searchbar} ${centeredStyle}`}
				initialValue={searchQuery}
				label="Search Manga/Manhwa Titles"
				onSearch={setSearchQuery}
				placeholder="Type here to search"
			/>

			{finishedAnimating && searchQuery.length > 0 && (
				<Grid gutter="xs" m={0}>
					<SearchResults results={results} />
				</Grid>
			)}
		</Container>
	);
}
