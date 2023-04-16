import { type ChangeEvent, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { Button, Group } from '@mantine/core';
import {
	IconChevronDown,
	IconChevronUp,
	IconClock,
	IconSearch,
	IconSelector,
} from '@tabler/icons-react';

import { TextInput } from '@/components/common';

import styles from './item-contents-chapters.module.scss';

import type { Chapter, ItemContents } from '../interfaces';

type SortableKeys = keyof Pick<Chapter, 'date' | 'label'>;

type SortBy = [SortableKeys, 'asc' | 'desc' | 'none'];

interface ItemContentsChaptersProps {
	chapters: ItemContents['chapters'];
	sort: Partial<Record<SortableKeys, string>>;
}

export default function ItemContentsChapters({
	chapters,
	sort,
}: ItemContentsChaptersProps): JSX.Element {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const [sortBy, setSortBy] = useState<SortBy>(['label', 'none']);

	const [, searchStartTransition] = useTransition();

	const [, sortStartTransition] = useTransition();

	const handleChange = ({
		target: { value },
	}: ChangeEvent<HTMLInputElement>): void => {
		searchStartTransition((): void => {
			setSearchQuery(value);
		});
	};

	const jsxChaptersLinks: JSX.Element[] = useMemo(
		(): JSX.Element[] =>
			chapters
				.filter(
					({ label, timeSince }: Chapter): boolean =>
						label.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(timeSince?.includes(searchQuery.toLowerCase()) ?? false)
				)
				.sort((a, b): number => {
					const [target, direction] = sortBy;

					const item1: string = a[target];
					const item2: string = b[target];

					const opts: Intl.CollatorOptions = {
						numeric: true,
						sensitivity: 'base',
					};

					switch (direction) {
						case 'asc': {
							return item2.localeCompare(item1, undefined, opts);
						}
						case 'desc': {
							return item1.localeCompare(item2, undefined, opts);
						}
						default: {
							return 0;
						}
					}
				})
				.map(
					({ date, label, link, timeSince }: Chapter): JSX.Element => (
						<Link
							aria-label={label}
							className={styles.item}
							href={{
								pathname: '/reader',
								query: { chapter: link },
							}}
							key={link}
						>
							<span>{label}</span>
							<div className={styles.time}>
								<IconClock size="0.875rem" stroke={1.5} />
								{timeSince ?? date}
							</div>
						</Link>
					)
				),
		[chapters, searchQuery, sortBy]
	);

	const jsxSortButton = (label: string, value: SortableKeys): JSX.Element => {
		const [target, direction] = sortBy;

		const DirectionIcon =
			target === value && direction === 'asc' ? IconChevronUp : IconChevronDown;

		const DefaultIcon =
			target !== value || direction === 'none' ? IconSelector : DirectionIcon;

		const handleClick = (): void => {
			sortStartTransition((): void => {
				if (direction === 'none' || target !== value) {
					setSortBy([value, 'desc']);

					return;
				}

				if (direction === 'desc') {
					setSortBy([value, 'asc']);

					return;
				}

				setSortBy([value, 'none']);
			});
		};

		return (
			<Button
				aria-label={`Sort by ${label}`}
				className={styles['sort-button']}
				compact
				key={value}
				onClick={handleClick}
				rightIcon={<DefaultIcon size={16} stroke={1.5} />}
				variant="subtle"
			>
				{label}
			</Button>
		);
	};

	const jsxSortButtons: JSX.Element[] = Object.entries(sort).map(
		([key, label]): JSX.Element => jsxSortButton(label, key as SortableKeys)
	);

	const jsxEmpty: JSX.Element = (
		<span className={styles.empty}>No chapters found</span>
	);

	return (
		<div className={styles.container}>
			<TextInput
				icon={<IconSearch size="1rem" stroke={1.5} />}
				label="Search"
				onChange={handleChange}
				placeholder="Search chapters"
				size="sm"
			/>

			<Group align="center" grow position="center" py="xs">
				{jsxSortButtons}
			</Group>

			<div className={styles.scroll}>
				{jsxChaptersLinks.length > 0 ? jsxChaptersLinks : jsxEmpty}
			</div>
		</div>
	);
}
