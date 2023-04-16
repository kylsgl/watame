import { useRouter } from 'next/router';
import { Group, Header as MantineHeader } from '@mantine/core';

import { HEADER_HEIGHT } from '@/constants';

import Logo from '../icons/logo';

import styles from './header.module.scss';

import NavbarControlButton from '../navbar/navbar-control-button';
import NavbarBurgerButton from '../navbar/navbar-burger-button';
import HeaderTitle from './header-title';

interface HeaderProps {
	className?: string;
}

export default function Header({ className = '' }: HeaderProps): JSX.Element {
	const { pathname } = useRouter();
	const isReader: boolean = pathname === '/reader';

	if (isReader) {
		return (
			<MantineHeader
				position={{
					bottom: 0,
				}}
				className={`${styles.header} ${styles.reader} ${className}`}
				style={{ marginBottom: HEADER_HEIGHT }}
				height={{ base: 0 }}
			>
				<Group position="apart" noWrap style={{ overflow: 'hidden' }}>
					{/* <Burger opened={isMenuOpen} onClick={onMenuClick} size="sm" /> */}
					<NavbarBurgerButton />
					<HeaderTitle />

					<NavbarControlButton collapsed />
				</Group>
			</MantineHeader>
		);
	}

	return (
		<MantineHeader
			className={`${styles.header} ${className}`}
			height={{ base: HEADER_HEIGHT }}
		>
			<Group>
				<NavbarBurgerButton />
				<Logo className={styles.logo} />
			</Group>
		</MantineHeader>
	);
}
