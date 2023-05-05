import Link from 'next/link';
import { type ButtonProps, Button, Tooltip } from '@mantine/core';

import styles from './navbar-item.module.scss';

import type { NavbarItemData } from './interfaces';

import NavbarItemIcon from './navbar-item-icon';

interface NavbarItemProps extends NavbarItemData {
	button?: boolean;
	className?: string;
	collapsed?: boolean;
	disabled?: boolean;
	isActive?: boolean;
	onClick?: () => void;
	tooltip?: boolean;
}

export default function NavbarItem({
	button = false,
	className = '',
	collapsed = false,
	disabled = false,
	icon,
	isActive = false,
	label,
	link,
	onClick,
	tooltip = false,
	variant,
}: NavbarItemProps): JSX.Element {
	const activeStyle: string = isActive ? styles.active : '';
	const slimStyle: string = collapsed ? styles.slim : '';
	const variantStyle: ButtonProps['variant'] = variant ?? 'default';

	const commonStyles = `${styles.item} ${slimStyle} ${activeStyle} ${className}`;

	const jsxIcon: JSX.Element = (
		<NavbarItemIcon collapsed={collapsed} Icon={icon} isActive={isActive} />
	);

	const jsxItem = (
		<div className={commonStyles}>
			{jsxIcon}
			{!collapsed && <span>{label}</span>}
		</div>
	);

	const jsxButton = (): JSX.Element => {
		const jsxButtonElement: JSX.Element = (
			<Tooltip disabled={!tooltip} label={label} withArrow>
				<Button
					aria-label={label}
					className={`${styles.button} ${commonStyles}`}
					disabled={disabled}
					variant={variantStyle}
					onClick={onClick}
				>
					{jsxIcon}
					{!collapsed && <span>{label}</span>}
				</Button>
			</Tooltip>
		);

		if (link != null && link.length > 0) {
			return (
				<Link
					className={styles.link}
					href={{ pathname: link }}
					scroll
					shallow={false}
				>
					{jsxButtonElement}
				</Link>
			);
		}

		return jsxButtonElement;
	};

	return button ? jsxButton() : jsxItem;
}
