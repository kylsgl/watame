import { Navbar as MantineNavbar } from '@mantine/core';

import styles from './navbar.module.scss';

import NavbarHeader from './navbar-header';
import NavbarFooter from './navbar-footer';
import NavbarContents from './navbar-contents';

export interface NavbarProps {
	className?: string;
	collapsed?: boolean;
	collapsible?: boolean;
	drawer?: boolean;
	onCollapseClick: () => void;
	width?: number;
}

export default function Navbar({
	className = '',
	collapsed = false,
	collapsible = true,
	drawer = false,
	onCollapseClick,
	width,
}: NavbarProps): JSX.Element {
	return (
		<MantineNavbar
			className={`
			${styles.navbar}
			${collapsed && !drawer ? styles.slim : ''}
			${className}
		`}
			// fixed={true}
			width={{ base: width }}
		>
			<NavbarHeader
				collapsed={collapsed && !drawer}
				showMenu={collapsed && !drawer}
			/>

			<NavbarContents collapsed={collapsed} drawer={drawer} />

			<NavbarFooter
				collapsed={collapsed}
				collapsible={collapsible}
				drawer={drawer}
				onCollapseClick={onCollapseClick}
			/>
		</MantineNavbar>
	);
}
