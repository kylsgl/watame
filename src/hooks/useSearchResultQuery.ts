import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import {
	type UseQueryOptions,
	type UseQueryResult,
	useQueries,
} from '@tanstack/react-query';

import { sourcesStateAtom } from '../store';

import {
	type SearchResult,
	type SourceSearchResults,
} from '../components/search';

import { sourcesInstances } from '../services/sources';

export default function useSearchResultQuery(
	query: string
): Array<UseQueryResult<SourceSearchResults>> {
	const sourcesState = useAtomValue(sourcesStateAtom);

	const results = useQueries({
		queries: Object.keys(sourcesState)
			.filter((key: string): boolean => sourcesState[key].enabled)
			.map(
				(
					source: string
				): Omit<
					UseQueryOptions<
						SearchResult[],
						unknown,
						SourceSearchResults,
						string[]
					>,
					'initialData'
				> => ({
					enabled: false,
					// cacheTime: 1e4, // 5e3,
					staleTime: Infinity,
					keepPreviousData: false,
					networkMode: 'offlineFirst',
					retry: 0,
					retryDelay: 5e3,
					// retryOnMount: false,
					refetchOnMount: false,
					refetchOnWindowFocus: false,
					refetchIntervalInBackground: false,
					select: (data: SearchResult[]): SourceSearchResults => [
						sourcesInstances[source]?.source.title ?? source,
						data,
					],
					queryKey: [source, query],
					queryFn: async (): Promise<SearchResult[]> =>
						sourcesInstances[source]?.source.searchByTitle(query) ?? [],
				})
			),
	});

	useEffect((): void => {
		if (query.length <= 0) {
			return;
		}

		results.forEach((result: UseQueryResult<SourceSearchResults>): void => {
			if (
				result.fetchStatus === 'idle' &&
				!result.isError &&
				!result.isFetchedAfterMount &&
				result.isStale
			) {
				result.refetch().catch(console.warn);
			}
		});
	}, [results, query.length]);

	return results;
}
