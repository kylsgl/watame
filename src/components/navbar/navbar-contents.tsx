import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { IconBook, IconHome, IconSearch } from '@tabler/icons-react';

import { openedTitleAtom } from '@/store';

import type { NavbarItemData } from './interfaces';
import { type NavbarProps } from './navbar';
import NavbarItems from './navbar-items';
import NavbarControl from './navbar-control';

const mainItems: NavbarItemData[] = [
	{ link: '/', label: 'Home', icon: IconHome },
	{ link: '/search', label: 'Search', icon: IconSearch },
	// { link: '/browse', label: 'Browse', icon: IconBooks },
	{ link: '/reader', label: 'Reader', icon: IconBook },
	// { link: '/user', label: 'User', icon: IconUser },
];

export default function NavbarContents({
	collapsed = false,
	drawer = false,
}: Pick<NavbarProps, 'collapsed' | 'drawer'>): JSX.Element {
	const {
		current: { chapterUrl },
	} = useAtomValue(openedTitleAtom);

	const { pathname } = useRouter();

	const isReader: boolean = pathname === '/reader';

	return (
		<>
			<NavbarItems
				borderBottom={isReader && chapterUrl.length > 0}
				collapsed={collapsed && !drawer}
				items={mainItems}
				grow={!isReader}
			/>

			{isReader && <NavbarControl collapsed={collapsed && !drawer} />}
		</>
	);
}
