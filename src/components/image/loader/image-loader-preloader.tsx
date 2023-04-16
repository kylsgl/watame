import { Fragment, useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { type UseQueryResult } from '@tanstack/react-query';

import {
	type ImageLoaderStatusAtom,
	imageLoaderStatusAtom,
	imageUrlCacheBaseAtom,
} from '@/store';
import { useImageLoaderQuery } from '@/hooks';

interface ImageLoaderPreloaderProps {
	imageUrls: string[];
	preload?: number;
}

export default function ImageLoaderPreloader({
	imageUrls,
	preload = 0,
}: ImageLoaderPreloaderProps): JSX.Element {
	const { activeIndex, status } = useAtomValue(imageLoaderStatusAtom);

	const imageUrlCache = useAtomValue(imageUrlCacheBaseAtom);

	const statusMemo = useMemo(
		(): ImageLoaderStatusAtom['status'] => status,
		[status]
	);

	const queries: Array<UseQueryResult<string>> = useImageLoaderQuery(imageUrls);

	useEffect((): void => {
		const imagesToLoad: Array<UseQueryResult<string>> = [];

		const refetchQuery = (idx: number, query: UseQueryResult<string>): void => {
			const imageUrl: string = imageUrls[idx];

			if (
				idx >= 0 &&
				idx < imageUrls.length &&
				query.fetchStatus === 'idle' &&
				query.isStale &&
				imageUrlCache.get(imageUrl) == null &&
				(statusMemo[imageUrl] == null || statusMemo[imageUrl] === 'refetch')
			) {
				imagesToLoad.push(query);
			}
		};

		for (let idx1 = imageUrls.length; idx1 >= 0; idx1 -= 1) {
			if (imageUrls[idx1] in statusMemo) {
				if (preload > 0 && activeIndex === idx1) {
					for (let idx2 = idx1 - preload; idx2 <= idx1 + preload; idx2 += 1) {
						refetchQuery(idx2, queries[idx2]);
					}
				} else {
					refetchQuery(idx1, queries[idx1]);
				}
			}
		}

		if (imagesToLoad.length > 0) {
			Promise.all(
				imagesToLoad.map(
					async (imageQuery: UseQueryResult<string>): Promise<void> => {
						await imageQuery.refetch();
					}
				)
			).catch(console.warn);
		}
	}, [activeIndex, imageUrlCache, imageUrls, preload, queries, statusMemo]);

	return <Fragment></Fragment>;
}
