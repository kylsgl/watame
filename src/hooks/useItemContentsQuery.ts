import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import type { Chapter, ItemContents } from '../components/item';

import { sourcesInstances } from '../services/sources';
import { getTimeSince } from '../lib/utils';

const PLACEHOLDER: ItemContents = {
	altTitle: 'N/A',
	author: [],
	chapters: [],
	description: 'N/A',
	genre: [],
	image: 'N/A',
	rating: 0,
	status: 'N/A',
	title: 'N/A',
	year: 'N/A',
};

export default function useItemContentsQuery(
	enabled: boolean,
	url: string,
	onSuccess?: () => void
): UseQueryResult<ItemContents> {
	return useQuery({
		enabled,
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
		onSuccess,
		placeholderData: PLACEHOLDER,
		queryKey: [url],
		queryFn: async (): Promise<ItemContents> => {
			const response: ItemContents | null | undefined = await sourcesInstances[
				url
			]?.source.getItemContents(url);

			if (response == null) {
				return PLACEHOLDER;
			}

			response.author = response.author.map((author: string): string =>
				author.trim().toLowerCase()
			);

			//  Add "timeSince" property
			response.chapters = response.chapters.map((chapter: Chapter): Chapter => {
				const parsedDate: number = Date.parse(chapter.date);

				const isNan: boolean = Number.isNaN(parsedDate);

				return {
					...chapter,
					date: isNan ? chapter.date : new Date(parsedDate).toISOString(),
					timeSince: isNan ? 'N/A' : getTimeSince(parsedDate),
				};
			});

			response.genre = response.genre.map((genre: string): string =>
				genre.trim().toLowerCase()
			);

			return response;
		},
	});
}
