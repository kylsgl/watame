import { Fragment } from 'react';
import { Group } from '@mantine/core';

import styles from './navbar-header.module.scss';

import Logo from '../icons/logo';

import NavbarSection from './navbar-section';
import NavbarBurgerButton from './navbar-burger-button';
import SettingsItemDarkMode from '../settings/item/settings-item-dark-mode';

interface NavbarHeaderProps {
	collapsed: boolean;
	showMenu?: boolean;
}

export default function NavbarHeader({
	collapsed = false,
	showMenu = true,
}: NavbarHeaderProps): JSX.Element {
	return (
		<NavbarSection
			borderBottom={collapsed}
			className={!collapsed ? styles['margin-bottom'] : ''}
		>
			<Group className={styles.header} spacing="xs" position="apart">
				{showMenu && collapsed && <NavbarBurgerButton />}
				{!collapsed && (
					<>
						<Logo className={styles.logo} />

						<SettingsItemDarkMode compact />
					</>
				)}
			</Group>
		</NavbarSection>
	);
}
