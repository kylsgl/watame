import { Divider } from '@mantine/core';

import styles from './control-panel.module.scss';

import ControlChapterSelector from './control-chapter';
import ControlDetails from './control-details';
import ControlPageSelector from './control-page';

import SettingsPanel from '../settings/settings-panel';

import Toolbar from '../toolbar/toolbar';
import ToolbarRemove from '../toolbar/toolbar-remove';

interface ControlPanelProps {
	className?: string;
	disablePage?: boolean;
	showDetails?: boolean;
	showSettings?: boolean;
}

export default function ControlPanel({
	className = '',
	disablePage = false,
	showDetails = false,
	showSettings = false,
}: ControlPanelProps): JSX.Element {
	return (
		<div className={`${styles.panel} ${className}`}>
			{showDetails && <ControlDetails />}
			<ControlChapterSelector className={styles.selector} />
			<ControlPageSelector className={styles.selector} disabled={disablePage} />
			<Toolbar />
			{showSettings && <SettingsPanel />}
			<Divider size="xs" />
			<ToolbarRemove />
		</div>
	);
}
