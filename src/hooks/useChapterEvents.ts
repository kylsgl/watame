import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';

import {
	horizontalReaderOptsAtom,
	openedTitleAtom,
	openedTitleCurrentPageAtom,
} from '@/store';

import { getCurrentPageNumber, updatePageHash } from '@/lib/utils';

export interface MoveChapterEvent {
	chapter?: 'prev' | 'next' | number;
	page?: 'first' | 'last' | number;
}

export interface MovePageEvent {
	page?: 'next' | 'prev' | number;
}

export interface MovePageShallowEvent {
	page: number;
}

export default function useChapterEvents(): void {
	const [
		{
			chapterPages,
			chapterUrls,
			current: { chapterIndex, pageCount },
		},
		setOpenedTitle,
	] = useAtom(openedTitleAtom);

	const { pages } = useAtomValue(horizontalReaderOptsAtom);

	const setOpenedTitleCurrentPage = useSetAtom(openedTitleCurrentPageAtom);

	const { push } = useRouter();

	useEffect((): (() => void) => {
		const removeChapter = (): void => {
			push({ pathname: '/reader', query: { chapter: 'none' } }, '/reader', {
				shallow: true,
			})
				.then((): void => {
					setOpenedTitle({
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
				})
				.catch(console.warn);
		};

		window.addEventListener('chapter:remove', removeChapter);
		return (): void => {
			window.removeEventListener('chapter:remove', removeChapter);
		};
	}, [push, setOpenedTitle]);

	useEffect((): (() => void) => {
		const moveChapter = ({
			detail,
		}: Event & { detail?: MoveChapterEvent }): void => {
			const chapter = detail?.chapter ?? 0;
			const page = detail?.page ?? 'first';

			let url: string | null | undefined;

			switch (chapter) {
				case 'next': {
					url = chapterUrls[chapterIndex + 1];
					break;
				}
				case 'prev': {
					url = chapterUrls[chapterIndex - 1];
					break;
				}
				default: {
					url = chapterUrls[chapter];
					break;
				}
			}

			if (url == null) {
				return;
			}

			let pageNumber: number;

			switch (page) {
				case 'first': {
					pageNumber = 1;
					break;
				}
				case 'last': {
					pageNumber = chapterPages[url] ?? 0;
					break;
				}
				default: {
					pageNumber = page;
					break;
				}
			}

			push(
				{
					pathname: '/reader',
					query: { chapter: url },
					hash: `page=${pageNumber}`,
				},
				undefined,
				{
					shallow: false,
				}
			).catch(console.warn);
		};

		window.addEventListener('chapter', moveChapter);
		return (): void => {
			window.removeEventListener('chapter', moveChapter);
		};
	}, [chapterIndex, chapterPages, chapterUrls, push]);

	useEffect((): (() => void) => {
		const movePage = ({ detail }: Event & { detail?: MovePageEvent }): void => {
			const currentPage = getCurrentPageNumber();

			let page = detail?.page ?? 0;

			switch (page) {
				case 'next': {
					page = currentPage + pages;
					break;
				}
				case 'prev': {
					page = currentPage - pages;
					break;
				}
				default: {
					break;
				}
			}

			if (page < 1 || page > pageCount || page === currentPage) {
				return;
			}

			updatePageHash(page);
		};

		window.addEventListener('chapter:page', movePage);
		return (): void => {
			window.removeEventListener('chapter:page', movePage);
		};
	}, [pages, pageCount]);

	useEffect((): (() => void) => {
		const movePageShallow = ({
			detail,
		}: Event & { detail?: MovePageShallowEvent }): void => {
			const page = detail?.page ?? 1;

			window.history.replaceState(window.history.state, '', `#page=${page}`);

			setOpenedTitleCurrentPage(page);
		};

		window.addEventListener('chapter:page:shallow', movePageShallow);
		return (): void => {
			window.removeEventListener('chapter:page:shallow', movePageShallow);
		};
	}, [setOpenedTitleCurrentPage]);
}
