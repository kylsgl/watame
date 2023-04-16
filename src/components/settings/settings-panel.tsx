import { Fragment } from 'react';
import { useAtom } from 'jotai';

import { globalOptsAtom } from '@/store';

import styles from './settings-panel.module.scss';

import SettingsHorizontal from './settings-horizontal';
import SettingsVertical from './settings-vertical';
import SettingsItemReaderLayout from './item/settings-item-reader-layout';

export default function SettingsPanel(): JSX.Element {
	const [{ readerLayout }] = useAtom(globalOptsAtom);

	return (
		<Fragment>
			<SettingsItemReaderLayout compact />
			{readerLayout === 'horizontal' ? (
				<SettingsHorizontal className={styles['segment-control']} />
			) : (
				<SettingsVertical className={styles['segment-control']} />
			)}
		</Fragment>
	);
}
