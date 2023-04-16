import { useAtomValue } from 'jotai';

import { openedTitleAtom } from '@/store';

import styles from './navbar-control.module.scss';

import ControlPanel from '../control/control-panel';
import NavbarSection from './navbar-section';
import NavbarControlButton from './navbar-control-button';

interface NavbarControlProps {
	collapsed: boolean;
}

export default function NavbarControl({
	collapsed = false,
}: NavbarControlProps): JSX.Element {
	const {
		current: { chapterUrl },
	} = useAtomValue(openedTitleAtom);

	return (
		<NavbarSection
			className={chapterUrl.length <= 0 ? styles.hidden : ''}
			grow
			scroll={!collapsed}
		>
			{collapsed ? (
				<NavbarControlButton collapsed />
			) : (
				<ControlPanel showDetails showSettings />
			)}
		</NavbarSection>
	);
}
