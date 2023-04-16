// import { type ItemContents } from '@/components/item';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface LibraryEntry {
	author: string[];
	chapterIndex: number;
	chapterUrl: string;
	chaptersCount: number;
	genre: string[];
	imageUrl: string;
	itemUrl: string;
	title: string;
}

export type BookmarksAtom = Record<string, LibraryEntry>;

export const bookmarksAtom = atomWithStorage<BookmarksAtom>('bookmarks', {});

export const historyBaseAtom = atomWithStorage<LibraryEntry[]>('history', []);

export const historyAtom = atom(
	(get): LibraryEntry[] => get(historyBaseAtom),
	(get, set, entry: LibraryEntry): void => {
		const historyArr: LibraryEntry[] = get(historyBaseAtom).filter(
			({ itemUrl }: LibraryEntry) => itemUrl !== entry.itemUrl
		);

		historyArr.unshift(entry);

		// ! 100 max entries
		if (historyArr.length > 100) {
			historyArr.length = 100;
		}

		set(historyBaseAtom, historyArr);
	}
);
