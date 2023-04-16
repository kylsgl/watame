import { type ChangeEvent, useEffect, useState } from 'react';
import { ActionIcon, Loader } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

import { TextInput } from '@/components/common';

import styles from './search-bar.module.scss';

interface BrowseSearchProps {
	className?: string;
	initialValue?: string;
	label: string;
	onSearch: (searchQuery: string) => void;
	placeholder: string;
}

export default function SearchBar({
	className = '',
	initialValue = '',
	label,
	onSearch,
	placeholder,
}: BrowseSearchProps): JSX.Element {
	const [searchQuery, setSearchQuery] = useState<string>(initialValue);
	const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

	useEffect((): (() => void) | undefined => {
		if (searchQuery.length <= 0) {
			onSearch('');
			setIsSearchLoading(false);
			return undefined;
		}

		setIsSearchLoading(true);

		const debounceSearch = setTimeout((): void => {
			onSearch(searchQuery);
			setIsSearchLoading(false);
		}, 2000);

		return (): void => {
			clearTimeout(debounceSearch);
		};
	}, [searchQuery, onSearch]);

	const handleChange = ({
		target: { value },
	}: ChangeEvent<HTMLInputElement>): void => {
		setSearchQuery(value);
	};

	const handleClear = (): void => {
		setSearchQuery('');
	};

	const jsxClearButton: JSX.Element = (
		<ActionIcon
			aria-label="Clear search"
			onClick={handleClear}
			size="xl"
			variant="transparent"
		>
			<IconX size="1.625rem" stroke={1.5} />
		</ActionIcon>
	);

	return (
		<TextInput
			className={`${styles.searchbar} ${className}`}
			icon={<IconSearch size="1.625rem" stroke={1.5} />}
			label={label}
			onChange={handleChange}
			placeholder={placeholder}
			rightSection={
				isSearchLoading ? (
					<Loader size={29} />
				) : (
					searchQuery.length > 0 && jsxClearButton
				)
			}
			value={searchQuery}
		/>
	);
}
