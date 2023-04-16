import { atom } from 'jotai';

import { type Chapter } from '../components/item';
import type Source from '../services/sources/Source';

export interface OpenedTitleAtom {
	chapters: Chapter[];
	chapterPages: Record<string, number | undefined>;
	chapterUrls: Array<Chapter['link'] | undefined>;
	current: {
		chapterIndex: number;
		chapterLabel: string;
		chapterUrl: string;
		pageCount: number;
		pageUrls: string[];
	};
	itemTitle: string;
	itemUrl: string;
	source: Source | null; // ! must not accept null
}

export const openedTitleAtom = atom<OpenedTitleAtom>({
	chapters: [],
	chapterPages: {},
	chapterUrls: [],
	current: {
		chapterIndex: 0,
		chapterLabel: '',
		chapterUrl: '',
		pageCount: 0,
		pageUrls: [],
	},
	itemTitle: '',
	itemUrl: '',
	source: null,
});

export const openedTitleCurrentPageAtom = atom<number>(1);
