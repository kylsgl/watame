import { useSetAtom } from 'jotai';
import { IconMenu2 } from '@tabler/icons-react';

import { drawerAtom } from '@/store';

import NavbarItem from './navbar-item';

export default function NavbarBurgerButton(): JSX.Element {
	const setDrawer = useSetAtom(drawerAtom);

	const handleClick = (): void => {
		setDrawer(true);
	};

	return (
		<NavbarItem
			button
			collapsed
			icon={IconMenu2}
			label="Show/Hide Menu Drawer"
			onClick={handleClick}
			variant="subtle"
		/>
	);
}
