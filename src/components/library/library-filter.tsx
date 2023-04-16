import {
	type ChangeEvent,
	Fragment,
	useMemo,
	useState,
	useTransition,
} from 'react';
import Link from 'next/link';
import { type SelectItem, Select, ActionIcon, Divider } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

import { type LibraryEntry } from '@/store/libraryAtom';
import { ItemsCard, TextInput } from '@/components/common';

import styles from './library-filter.module.scss';

interface LibraryFilterProps {
	className?: string;
	entries: LibraryEntry[];
	itemWrapper: (
		entry: LibraryEntry
	) => JSX.Element | JSX.Element[] | null | undefined;
	itemsWrapper: (
		items: Array<JSX.Element | JSX.Element[] | null | undefined>
	) => JSX.Element | JSX.Element[] | null | undefined;
}

export default function LibraryFilter({
	className = '',
	entries,
	itemWrapper,
	itemsWrapper,
}: LibraryFilterProps): JSX.Element {
	const [titleFilter, setTitleFilter] = useState<string>('');

	const [genreFilter, setGenreFilter] = useState<string>('all');

	const [, titleStartTransition] = useTransition();

	const [, genreStartTransition] = useTransition();

	const selectItems = useMemo((): SelectItem[] => {
		const bookmarksGenre: string[] = entries
			.reduce(
				(acc: string[], { genre }: LibraryEntry): string[] => [
					...acc,
					...genre,
				],
				[]
			)
			.sort((a, b) => a.localeCompare(b));

		const filteredGenreArr: string[] = Array.from(new Set(bookmarksGenre));

		const genreSelectItems: SelectItem[] = [
			{ value: 'all', label: 'all' },
			...filteredGenreArr.map(
				(genre: string): SelectItem => ({ value: genre, label: genre })
			),
		];

		return genreSelectItems;
	}, [entries]);

	const filteredItems: LibraryEntry[] = useMemo(
		(): LibraryEntry[] =>
			entries
				.filter(
					({ genre, title }: LibraryEntry) =>
						(genreFilter !== 'all' ? genre.includes(genreFilter) : true) &&
						title.toLowerCase().includes(titleFilter.toLowerCase())
				)
				.sort((a, b) => a.title.localeCompare(b.title)),
		[entries, genreFilter, titleFilter]
	);

	const handleInputChange = ({
		target: { value },
	}: ChangeEvent<HTMLInputElement>): void => {
		titleStartTransition((): void => {
			setTitleFilter(value);
		});
	};

	const handleSelectChange = (value: string | null): void => {
		genreStartTransition((): void => {
			setGenreFilter(value ?? 'all');
		});
	};

	const handleClear = (): void => {
		titleStartTransition((): void => {
			setTitleFilter('');
		});
	};

	const jsxClearButton: JSX.Element = (
		<ActionIcon
			aria-label="Clear search"
			onClick={handleClear}
			size="xl"
			variant="transparent"
		>
			<IconX size="1rem" />
		</ActionIcon>
	);

	const jsxEmpty: JSX.Element = (
		<Fragment>
			<span className={styles.empty}>
				<span>No titles found</span>

				{entries.length <= 0 ? (
					<Fragment>
						<Divider className={styles.divider} size="sm" />
						<Link
							className={styles.search}
							href={{
								pathname: '/search',
							}}
						>
							<IconSearch size={16} stroke={1.5} />
							Search Titles
						</Link>
					</Fragment>
				) : null}
			</span>
		</Fragment>
	);

	return (
		<ItemsCard
			className={`${styles['items-card']} ${className}`}
			skeleton={false}
		>
			<div className={styles.filters}>
				<TextInput
					className={styles['title-filter']}
					defaultValue={titleFilter}
					icon={<IconSearch size="1rem" />}
					label="Search Titles"
					onChange={handleInputChange}
					placeholder="Search Titles"
					rightSection={titleFilter.length > 0 ? jsxClearButton : null}
					size="sm"
					value={titleFilter}
				/>

				<Select
					className={styles['genre-filter']}
					clearable={genreFilter !== 'all'}
					data={selectItems}
					defaultValue={genreFilter}
					onChange={handleSelectChange}
					placeholder="All"
					searchable
					value={genreFilter}
				/>
			</div>

			<Fragment>
				{filteredItems.length > 0
					? itemsWrapper(filteredItems.map(itemWrapper))
					: jsxEmpty}
			</Fragment>
		</ItemsCard>
	);
}
