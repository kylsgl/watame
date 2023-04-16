import { useSetAtom } from 'jotai';
import {
	type QueryFunctionContext,
	type UseQueryOptions,
	type UseQueryResult,
	useQueries,
} from '@tanstack/react-query';

import { type ImageLoaderStatusAtom, imageLoaderStatusAtom } from '../store';

import Source from '../services/sources/Source';

export default function useImageLoaderQuery(
	imageUrls: string[]
): Array<UseQueryResult<string>> {
	const setImageLoaderStatus = useSetAtom(imageLoaderStatusAtom);

	return useQueries({
		queries: imageUrls.map(
			(url: string): UseQueryOptions<string> => ({
				enabled: false,
				// cacheTime: 1e4, // 5e3,
				staleTime: Infinity, // 36e5
				keepPreviousData: false,
				networkMode: 'offlineFirst',
				retry: false,
				// retryOnMount: false,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchIntervalInBackground: false,
				onError: (): void => {
					setImageLoaderStatus(
						(current): ImageLoaderStatusAtom => ({
							activeIndex: current.activeIndex,
							status: { ...current.status, [url]: 'error' },
						})
					);
				},
				onSuccess: (): void => {
					setImageLoaderStatus(
						(current): ImageLoaderStatusAtom => ({
							activeIndex: current.activeIndex,
							status: { ...current.status, [url]: 'ok' },
						})
					);
				},
				queryKey: [url],
				queryFn: async ({ signal }: QueryFunctionContext): Promise<string> =>
					Source.fetch(url, 'IMG', signal),
			})
		),
	});
}
