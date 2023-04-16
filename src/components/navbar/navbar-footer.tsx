import { useSetAtom } from 'jotai';
import {
	IconSettings,
	IconArrowBarToLeft,
	IconArrowBarToRight,
} from '@tabler/icons-react';

import { globalOpenedModalAtom } from '@/store';

import type { NavbarItemData } from './interfaces';

import { type NavbarProps } from './navbar';
import NavbarItems from './navbar-items';

export default function NavbarFooter({
	collapsed = false,
	collapsible = true,
	drawer = false,
	onCollapseClick,
}: Pick<
	NavbarProps,
	'collapsed' | 'collapsible' | 'drawer' | 'onCollapseClick'
>): JSX.Element {
	// const []
	const setGlobalOpenedModal = useSetAtom(globalOpenedModalAtom);

	// const handleNavbarCollapseClick = (): void => {
	// 	if (navbarCollapsed) {
	// 		setDrawerOpened(false);
	// 	}

	// 	setGlobalOpts(
	// 		(current): GlobalOpts => ({
	// 			...current,
	// 			navbarCollapsed: !current.navbarCollapsed,
	// 		})
	// 	);
	// };

	const handleSettingsClick = (): void => {
		setGlobalOpenedModal((current) =>
			current !== 'Settings' ? 'Settings' : 'None'
		);
	};

	const footerItems: NavbarItemData[] = [
		{
			link: '',
			label: 'Settings',
			icon: IconSettings,
			onClick: handleSettingsClick,
		},
		{
			hidden: !collapsible,
			link: '',
			label: collapsed ? 'Expand Sidebar' : 'Collapse Sidebar',
			icon: collapsed ? IconArrowBarToRight : IconArrowBarToLeft,
			onClick: onCollapseClick,
		},
	];

	return (
		<NavbarItems
			borderTop
			collapsed={collapsed && !drawer}
			items={footerItems}
		/>
	);
}
