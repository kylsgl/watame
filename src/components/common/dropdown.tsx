import { type FC, useMemo, useState } from 'react';
import { Group, Menu, UnstyledButton } from '@mantine/core';
import { type TablerIconsProps, IconChevronDown } from '@tabler/icons-react';

import styles from './dropdown.module.scss';

export interface DropdownItem<T> {
	icon: FC<TablerIconsProps>;
	label: string;
	value: T;
}

interface DropdownProps<T> {
	className?: string;
	defaultValue?: DropdownItem<T>;
	items: Array<DropdownItem<T>>;
	onSelect: (value: T) => void;
}

export function Dropdown<T>({
	className = '',
	defaultValue,
	items,
	onSelect,
}: DropdownProps<T>): JSX.Element {
	const [active, setActive] = useState<DropdownItem<T>>(
		defaultValue ?? items[0]
	);

	const [opened, setOpened] = useState<boolean>(false);

	const handleClose = (): void => {
		setOpened(false);
	};

	const handleOpen = (): void => {
		setOpened(true);
	};

	const jsxItems: JSX.Element[] = useMemo(
		(): JSX.Element[] =>
			items.map(
				({ icon: Icon, label, value }: DropdownItem<T>, idx: number) => {
					const handleClick = (): void => {
						onSelect(value);
						setActive(items[idx]);
					};

					return (
						<Menu.Item
							className={styles.item}
							icon={<Icon size="0.85rem" stroke={1.5} />}
							key={label}
							onClick={handleClick}
						>
							{label}
						</Menu.Item>
					);
				}
			),
		[items, onSelect]
	);

	return (
		<Menu
			onClose={handleClose}
			onOpen={handleOpen}
			radius="md"
			width="8.125rem"
		>
			<Menu.Target>
				<UnstyledButton className={`${styles.button} ${className}`}>
					<Group spacing="xs">
						<active.icon size="0.85rem" stroke={1.5} />
						<span className={styles.label}>{active.label}</span>
					</Group>
					<IconChevronDown
						className={`${styles.arrow} ${opened ? styles.opened : ''}`}
						size="0.85rem"
						stroke={1.5}
					/>
				</UnstyledButton>
			</Menu.Target>
			<Menu.Dropdown>{jsxItems}</Menu.Dropdown>
		</Menu>
	);
}
