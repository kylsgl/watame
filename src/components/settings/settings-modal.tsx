import { Fragment } from 'react';
import { useAtomValue } from 'jotai';
import { IconAt, IconBook, IconTool } from '@tabler/icons-react';

import { globalOpenedModalAtom } from '@/store';
import { type TabItem, type TabData, TabbedModal } from '@/components/common';

import styles from './settings-modal.module.scss';

import SettingsItemAnimations from './item/settings-item-animation';
import SettingsItemLayout from './item/settings-item-layout';
import SettingsItemPreload from './item/settings-item-preload';
import SettingsItemScroll from './item/settings-item-scroll';

import SettingsSources from './sources/settings-sources';
import SettingsItemReaderLayout from './item/settings-item-reader-layout';
import SettingsItemDarkMode from './item/settings-item-dark-mode';

const GENERAL_SETTINGS: TabItem = {
	content: (
		<Fragment>
			<SettingsItemLayout />
			<SettingsItemDarkMode />
			<SettingsItemAnimations />
		</Fragment>
	),
	icon: IconTool,
	title: 'General Settings',
	value: 'general',
};

const READER_SETTINGS: TabItem = {
	content: (
		<Fragment>
			<SettingsItemReaderLayout />
			<SettingsItemScroll />
			<SettingsItemPreload />
		</Fragment>
	),
	icon: IconBook,
	title: 'Reader Settings',
	value: 'reader',
};

const SOURCES_SETTINGS: TabItem = {
	content: <SettingsSources />,
	icon: IconAt,
	title: 'Manage Sources',
	value: 'sources',
};

const DATA: TabData = {
	defaultValue: 'general',
	items: [GENERAL_SETTINGS, READER_SETTINGS, SOURCES_SETTINGS],
};

interface SettingsModalProps {
	opened?: boolean;
}

export default function SettingsModal({
	opened,
}: SettingsModalProps): JSX.Element {
	const globalOpenedModal = useAtomValue(globalOpenedModalAtom);

	return (
		<TabbedModal
			className={styles['settings-modal']}
			data={DATA}
			lockScroll={true}
			opened={opened ?? globalOpenedModal === 'Settings'}
			withTooltip={true}
		/>
	);
}
