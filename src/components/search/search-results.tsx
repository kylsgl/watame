import { Fragment, useMemo } from 'react';
import { useAtom } from 'jotai';
import { type UseQueryResult } from '@tanstack/react-query';

import { globalOpenedModalAtom, searchOpenedUrlAtom } from '@/store';
import { ItemContentsModal } from '@/components/item';

import { type SourceSearchResults } from './interfaces';

import SearchResultsItem from './search-results-item';

interface SearchResultProps {
	results: Array<UseQueryResult<SourceSearchResults>>;
}

export default function SearchResults({
	results,
}: SearchResultProps): JSX.Element {
	const [globalOpenedModal, setGlobalOpenedModal] = useAtom(
		globalOpenedModalAtom
	);
	const [searchOpenedUrl, setSearchOpenedUrl] = useAtom(searchOpenedUrlAtom);

	const handleClose = (): void => {
		setGlobalOpenedModal('None');
	};

	const jsxResults: JSX.Element[] = useMemo((): JSX.Element[] => {
		const handleClick = (url: string): void => {
			setSearchOpenedUrl(url);
			setGlobalOpenedModal((current) => (current !== 'Item' ? 'Item' : 'None'));
		};

		return results.map(
			(result, idx): JSX.Element => (
				<SearchResultsItem
					key={result.data?.[0] ?? idx}
					item={result}
					onClick={handleClick}
				/>
			)
		);
	}, [results, setGlobalOpenedModal, setSearchOpenedUrl]);

	return (
		<>
			{jsxResults}
			<ItemContentsModal
				url={searchOpenedUrl}
				opened={globalOpenedModal === 'Item' && searchOpenedUrl.length > 0}
				onClose={handleClose}
			/>
		</>
	);
}
