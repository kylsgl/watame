import { Fragment } from 'react';
import { useAtom } from 'jotai';
import { AppShell } from '@mantine/core';

import { type GlobalOpts, globalOptsAtom } from '@/store';
import useResizeEvent from '@/hooks/useResizeEvent';

import { NAVBAR_WIDTH, NAVBAR_WIDTH_COLLAPSED } from '@/constants';

import styles from './layout.module.scss';

import Drawer from './drawer';
import Navbar from '../navbar/navbar';
import Header from './header';

import SettingsModal from '../settings/settings-modal';
import ReaderLoader from '../reader/reader-loader';

interface LayoutProps {
	children: JSX.Element;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
	useResizeEvent();

	const [{ layout, navbarCollapsed }, setGlobalOpts] = useAtom(globalOptsAtom);

	const isDesktop: boolean = layout === 'desktop';

	const navbarWidth: number = navbarCollapsed
		? NAVBAR_WIDTH_COLLAPSED
		: NAVBAR_WIDTH;

	const handleNavbarCollapseClick = (): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				navbarCollapsed: !current.navbarCollapsed,
			})
		);
	};

	return (
		<>
			<AppShell
				className={styles.appShell}
				header={!isDesktop ? <Header /> : undefined}
				navbar={
					isDesktop ? (
						<Navbar
							collapsed={navbarCollapsed}
							onCollapseClick={handleNavbarCollapseClick}
							width={navbarWidth}
						/>
					) : undefined
				}
				padding="xs"
			>
				{children}
			</AppShell>

			<Drawer
				collapsed={navbarCollapsed}
				collapsible={isDesktop}
				onCollapseClick={handleNavbarCollapseClick}
				width={isDesktop ? navbarWidth : 0}
			/>

			<SettingsModal />
			<ReaderLoader />
		</>
	);
}
