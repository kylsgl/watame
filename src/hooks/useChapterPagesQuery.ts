import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { sourcesInstances } from '../services/sources';

export default function useChapterPagesQuery(
	enabled: boolean,
	url: string,
	onSuccess?: ((data: string[]) => void) | undefined
): UseQueryResult<string[]> {
	return useQuery({
		enabled,
		// cacheTime: 1e4, // 5e3,
		staleTime: Infinity, // 36e5
		keepPreviousData: true,
		networkMode: 'offlineFirst',
		retry: 0,
		retryDelay: 5e3,
		// retryOnMount: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchIntervalInBackground: false,
		onSuccess,
		queryKey: [url],
		queryFn: async (): Promise<string[]> =>
			sourcesInstances[url]?.source.getChapterPages(url) ?? [],
	});
}
