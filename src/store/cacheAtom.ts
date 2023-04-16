import { atom } from 'jotai';

import { LRU } from '@/lib/LRU';

export const imageUrlCacheBaseAtom = atom(new LRU<string>(1024));

export const imageUrlCacheAtom = atom(
	(get): LRU<string> => get(imageUrlCacheBaseAtom),
	(get, set, value: string): void => {
		const cache: LRU<string> = get(imageUrlCacheBaseAtom);
		cache.add(value);
		set(imageUrlCacheBaseAtom, cache);
	}
);
