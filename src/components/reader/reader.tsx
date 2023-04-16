import { Fragment, useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Head from 'next/head';
import { Container, LoadingOverlay } from '@mantine/core';

import {
	type OpenedTitleAtom,
	openedTitleAtom,
	openedTitleCurrentPageAtom,
} from '@/store';
import { useChapterPagesQuery, useItemContentsQuery } from '@/hooks';
import type Source from '@/services/sources/Source';
import { sourcesInstances } from '@/services/sources';
import { updatePageHash } from '@/lib/utils';
import {
	type BookmarksAtom,
	type LibraryEntry,
	bookmarksAtom,
	historyAtom,
} from '@/store/libraryAtom';

import type { Chapter, ItemContents } from '../item';

import styles from './reader.module.scss';

import ReaderLayout from './reader-layout';

interface ReaderProps {
	chapterPage?: number;
	chapterUrl: string;
}

export default function Reader({
	chapterPage = 1,
	chapterUrl,
}: ReaderProps): JSX.Element {
	const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);

	const [openedTitle, setOpenedTitle] = useAtom(openedTitleAtom);

	const setOpenedTitleCurrentPage = useSetAtom(openedTitleCurrentPageAtom);

	const setHistory = useSetAtom(historyAtom);

	const handleSuccess = (
		{
			author,
			chapters,
			genre,
			image: imageUrl,
			title,
		}: ItemContents | Record<string, never>,
		pageUrls: string[]
	): void => {
		const source: Source | undefined = sourcesInstances[chapterUrl]?.source;
		if (source === undefined) {
			return;
		}

		const chapterIndex: number = openedTitle.chapterUrls.indexOf(chapterUrl);

		const chapterLabel: string =
			chapters.find((chapter: Chapter): boolean => chapter.link === chapterUrl)
				?.label ?? '';

		const pageCount: number = pageUrls.length;

		const page: number =
			chapterPage > pageCount || chapterPage === 0 ? pageCount : chapterPage;

		const currentChapter: OpenedTitleAtom['current'] = {
			chapterIndex,
			chapterLabel,
			chapterUrl,
			pageCount,
			pageUrls,
		};

		const itemUrl: string = source.getItemUrlFromChapterUrl(chapterUrl);

		const entry: LibraryEntry = {
			author,
			chapterIndex,
			chapterUrl,
			chaptersCount: chapters.length,
			genre,
			imageUrl,
			itemUrl,
			title,
		};

		updatePageHash(page);

		if (chapterIndex >= 0 && openedTitle.chapterUrls.length > 0) {
			// Add to existing title
			setOpenedTitle(
				(current): OpenedTitleAtom => ({
					...current,
					chapterPages: {
						...current.chapterPages,
						[chapterUrl]: pageCount,
					},
					current: currentChapter,
				})
			);
		} else {
			// Add new title
			const chapterUrls: string[] = chapters
				.map((chapter: Chapter): string => chapter.link)
				.reverse();

			const newChapterIndex: number = chapterUrls.indexOf(chapterUrl);
			currentChapter.chapterIndex = newChapterIndex;
			entry.chapterIndex = newChapterIndex;
			entry.chaptersCount = chapterUrls.length;

			setOpenedTitle({
				chapters,
				chapterPages: {
					[chapterUrl]: pageCount,
				},
				chapterUrls,
				current: currentChapter,
				itemTitle: title,
				itemUrl,
				source,
			});
		}

		setOpenedTitleCurrentPage(page);

		setHistory(entry);

		if (itemUrl in bookmarks) {
			setBookmarks(
				(current): BookmarksAtom => ({ ...current, [itemUrl]: entry })
			);
		}
	};

	// Item Contents Query
	const {
		data: itemContentsData,
		fetchStatus: itemContentsFetchStatus,
		isError: itemContentsIsError,
		isFetchedAfterMount: itemContentsIsFetchedAfterMount,
		isPaused: itemContentsIsPaused,
		isStale: itemContentsIsStale,
		refetch: itemContentsRefetch,
	} = useItemContentsQuery(
		false,
		sourcesInstances[chapterUrl]?.source.getItemUrlFromChapterUrl(chapterUrl) ??
			''
	);

	// Chapter Pages Query
	const {
		data: chapterPagesData,
		fetchStatus: chapterPagesFetchStatus,
		isError: chapterPagesIsError,
		isFetched: chapterPagesIsFetched,
		isFetchedAfterMount: chapterPagesIsFetchedAfterMount,
		isPaused: chapterPagesIsPaused,
		isStale: chapterPagesIsStale,
		isSuccess: chapterPagesIsSuccess,
		refetch: chapterPagesRefetch,
	} = useChapterPagesQuery(false, chapterUrl, (imgUrls: string[]): void => {
		if (imgUrls.length > 0 && itemContentsData != null) {
			handleSuccess(itemContentsData, imgUrls);
		}
	});

	const {
		chapterUrls,
		current: { chapterUrl: currentChapterUrl },
		itemTitle,
	} = openedTitle;

	useEffect((): void => {
		if (
			(currentChapterUrl === chapterUrl && !chapterPagesIsStale) ||
			chapterPagesIsFetchedAfterMount ||
			chapterPagesFetchStatus !== 'idle' ||
			itemContentsFetchStatus !== 'idle'
		) {
			return;
		}

		// Do not fetch item contents if chapter is part of the current title
		if (itemTitle.length > 0 && chapterUrls.includes(chapterUrl)) {
			chapterPagesRefetch().catch(console.warn);
			return;
		}

		if (!itemContentsIsFetchedAfterMount || itemContentsIsStale) {
			itemContentsRefetch()
				.then(async (): Promise<void> => {
					await chapterPagesRefetch();
				})
				.catch(console.warn);
		}
	}, [
		chapterPagesFetchStatus,
		chapterPagesIsFetchedAfterMount,
		chapterPagesIsStale,
		chapterPagesRefetch,
		chapterUrl,
		chapterUrls,
		currentChapterUrl,
		itemContentsFetchStatus,
		itemContentsIsFetchedAfterMount,
		itemContentsIsStale,
		itemContentsRefetch,
		itemTitle.length,
	]);

	if (chapterPagesIsSuccess && chapterPagesIsFetched) {
		const title = `${openedTitle.current.chapterLabel} | ${openedTitle.itemTitle} - Watame`;

		return (
			<Fragment>
				<Head>
					<title>{title}</title>
					<meta property="og:title" content={title} key="title" />
				</Head>
				<ReaderLayout
					className={styles.container}
					imageUrls={chapterPagesData}
				/>
			</Fragment>
		);
	}

	if (
		chapterPagesIsError ||
		itemContentsIsError ||
		chapterPagesIsPaused ||
		itemContentsIsPaused
	) {
		return (
			<Container p="xs" fluid>
				<span>something went wrong!</span>
			</Container>
		);
	}

	return (
		<LoadingOverlay
			id="loading-overlay"
			overlayBlur={1}
			overlayOpacity={0.1}
			visible
		/>
	);
}
