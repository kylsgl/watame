import { useAtom } from 'jotai';
import { type SegmentedControlItem, Box, Center } from '@mantine/core';
import { IconArrowsLeftRight, IconArrowsDownUp } from '@tabler/icons-react';

import { type GlobalOpts, globalOptsAtom } from '@/store';
import {
	type DropdownItem,
	Dropdown,
	SegmentedControl,
} from '@/components/common';

import SettingsItem from '../settings-item';

const segmentedControlItems: SegmentedControlItem[] = [
	{
		value: 'horizontal',
		label: (
			<Center>
				<IconArrowsLeftRight size={14} />
				<Box ml={10}>Horizontal</Box>
			</Center>
		),
	},
	{
		value: 'vertical',
		label: (
			<Center>
				<IconArrowsDownUp size={14} />
				<Box ml={10}>Vertical</Box>
			</Center>
		),
	},
];

const dropdownItems: Array<DropdownItem<GlobalOpts['readerLayout']>> = [
	{
		icon: IconArrowsLeftRight,
		label: 'Horizontal',
		value: 'horizontal',
	},
	{
		icon: IconArrowsDownUp,
		label: 'Vertical',
		value: 'vertical',
	},
];

interface SettingsItemReaderLayoutProps {
	compact?: boolean;
}

export default function SettingsItemReaderLayout({
	compact = false,
}: SettingsItemReaderLayoutProps): JSX.Element {
	const [{ readerLayout }, setGlobalOpts] = useAtom(globalOptsAtom);

	const handleChange = (): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				readerLayout:
					current.readerLayout === 'horizontal' ? 'vertical' : 'horizontal',
			})
		);
	};

	const handleSelect = (value: GlobalOpts['readerLayout']): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				readerLayout: value,
			})
		);
	};

	const jsxCompact: JSX.Element = (
		<SegmentedControl
			data={segmentedControlItems}
			label="Reader Layout"
			onChange={handleChange}
			value={readerLayout}
		/>
	);

	const jsxDefault: JSX.Element = (
		<SettingsItem
			title="Reader Layout"
			subtitle="Switch between horizontal and vertical Layout"
		>
			<Dropdown
				// className={styles.dropdown}
				defaultValue={dropdownItems.find(({ value }) => value === readerLayout)}
				items={dropdownItems}
				onSelect={handleSelect}
			/>
		</SettingsItem>
	);

	return compact ? jsxCompact : jsxDefault;
}
