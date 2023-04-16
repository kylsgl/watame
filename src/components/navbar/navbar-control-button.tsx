import { useSetAtom } from 'jotai';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';

import { globalOpenedModalAtom } from '../../store';

import NavbarItem from './navbar-item';

interface NavbarControlButtonProps {
	collapsed: boolean;
}

export default function NavbarControlButton({
	collapsed = false,
}: NavbarControlButtonProps): JSX.Element {
	const setGlobalOpenedModal = useSetAtom(globalOpenedModalAtom);

	const handleClick = (): void => {
		setGlobalOpenedModal((current) =>
			current !== 'Controls' ? 'Controls' : 'None'
		);
	};

	return (
		<NavbarItem
			button
			collapsed={collapsed}
			icon={IconAdjustmentsHorizontal}
			label="Select Chapter"
			onClick={handleClick}
			variant="subtle"
		/>
	);
}
