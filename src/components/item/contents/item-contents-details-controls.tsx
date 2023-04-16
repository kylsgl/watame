import { useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { ActionIcon } from '@mantine/core';
import { IconBook, IconBookmark } from '@tabler/icons-react';

import {
	type BookmarksAtom,
	type LibraryEntry,
	bookmarksAtom,
	historyAtom,
} from '@/store/libraryAtom';

import styles from './item-contents-details-controls.module.scss';

import type { Chapter, ItemContents } from '../interfaces';

function getLabel(chapters: Chapter[], chapterUrl: string): string {
	return `Continue: ${
		chapters.find(({ link }: Chapter) => link === chapterUrl)?.label ?? 'N/A'
	}`;
}

interface ItemContentsDetailsControlsProps {
	details: ItemContents;
	itemUrl: string;
}

export default function ItemContentsDetailsControls({
	details: { author, chapters, genre, image: imageUrl, title },
	itemUrl,
}: ItemContentsDetailsControlsProps): JSX.Element {
	const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);

	const historyEntry = useAtomValue(historyAtom).find(
		(entry: LibraryEntry) => entry.itemUrl === itemUrl
	);

	const handleClick = (): void => {
		setBookmarks((current): BookmarksAtom => {
			if (itemUrl in current) {
				const { [itemUrl]: item, ...items } = current;
				return items;
			}

			return {
				...current,
				[itemUrl]: historyEntry ?? {
					author,
					chapterIndex: -1,
					chapterUrl: '',
					chaptersCount: chapters.length,
					genre,
					imageUrl,
					itemUrl,
					title,
				},
			};
		});
	};
	const jsxBookmarkButton: JSX.Element = (
		<ActionIcon
			aria-label="Bookmark"
			className={styles.save}
			onClick={handleClick}
			size="xl"
		>
			<IconBookmark
				color={itemUrl in bookmarks ? '#FAB005' : undefined}
				fill={itemUrl in bookmarks ? '#FAB005' : 'transparent'}
				size="1.5rem"
			/>
		</ActionIcon>
	);

	const jsxReadButton = (): JSX.Element => {
		const item = bookmarks[itemUrl] as LibraryEntry | undefined;

		const itemChapterUrl: string | undefined =
			item?.chapterUrl ?? historyEntry?.chapterUrl;

		const isValidChapterUrl =
			itemChapterUrl !== undefined && itemChapterUrl.length > 0;

		const buttonLabel: string = isValidChapterUrl
			? getLabel(chapters, itemChapterUrl)
			: 'Start Reading';

		const href = {
			pathname: '/reader',
			query: {
				chapter: isValidChapterUrl ? itemChapterUrl : chapters.at(-1)?.link,
			},
		};

		return (
			<Link className={styles.read} href={href}>
				<IconBook size="1.5rem" />
				<span>{buttonLabel}</span>
			</Link>
		);
	};

	return (
		<div className={styles.container}>
			{jsxBookmarkButton}
			{jsxReadButton()}
		</div>
	);
}
