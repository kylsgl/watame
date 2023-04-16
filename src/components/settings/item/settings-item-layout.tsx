import { useAtom } from 'jotai';
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react';

import { type GlobalOpts, globalOptsAtom } from '@/store';
import { type DropdownItem, Dropdown } from '@/components/common';

import styles from './settings-item-layout.module.scss';

import SettingsItem from '../settings-item';

const items: Array<DropdownItem<GlobalOpts['layout']>> = [
	{
		icon: IconDeviceDesktop,
		label: 'Desktop',
		value: 'desktop',
	},
	{
		icon: IconDeviceMobile,
		label: 'Mobile',
		value: 'mobile',
	},
];

export default function SettingsItemLayout(): JSX.Element {
	const [globalOpts, setGlobalOpts] = useAtom(globalOptsAtom);

	const handleSelect = (value: GlobalOpts['layout']): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				layout: value,
			})
		);
	};

	return (
		<SettingsItem
			title="Layout"
			subtitle="Switch between desktop and mobile layout"
		>
			<Dropdown
				className={styles.dropdown}
				defaultValue={items.find(({ value }) => value === globalOpts.layout)}
				items={items}
				onSelect={handleSelect}
			/>
		</SettingsItem>
	);
}
