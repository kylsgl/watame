import { useMemo } from 'react';
import { useRouter } from 'next/router';

import type { NavbarItemData } from './interfaces';

import NavbarItem from './navbar-item';
import NavbarSection from './navbar-section';

interface NavbarItemsProps {
	borderBottom?: boolean;
	borderTop?: boolean;
	collapsed: boolean;
	items: NavbarItemData[];
	grow?: boolean;
}

export default function NavbarItems({
	borderTop = false,
	borderBottom = false,
	collapsed = false,
	items,
	grow = false,
}: NavbarItemsProps): JSX.Element {
	const { pathname } = useRouter();

	const jsxItems: Array<JSX.Element | null> = useMemo(
		(): Array<JSX.Element | null> =>
			items.map(
				({
					hidden,
					icon,
					label,
					link,
					onClick,
				}: NavbarItemData): JSX.Element | null =>
					hidden !== true ? (
						<NavbarItem
							button
							collapsed={collapsed}
							icon={icon}
							isActive={link === pathname}
							key={label}
							label={label}
							link={link}
							onClick={onClick}
							variant="subtle"
						/>
					) : null
			),
		[collapsed, items, pathname]
	);

	return (
		<NavbarSection
			borderBottom={borderBottom}
			borderTop={borderTop}
			grow={grow}
		>
			{jsxItems}
		</NavbarSection>
	);
}
