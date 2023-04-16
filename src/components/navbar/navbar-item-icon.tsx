import { type FC } from 'react';
import { type TablerIconsProps } from '@tabler/icons-react';

import styles from './navbar-item-icon.module.scss';

interface NavbarItemIconProps {
	className?: string;
	Icon: FC<TablerIconsProps>;
	isActive?: boolean;
	collapsed?: boolean;
}

export default function NavbarItemIcon({
	className = '',
	Icon,
	isActive = false,
	collapsed = false,
}: NavbarItemIconProps): JSX.Element {
	const classNames = `
		${className}
		${isActive ? styles.active : ''}
		${collapsed ? styles.slim : ''}
	`;

	return (
		<Icon
			className={`${styles.icon} ${classNames}`}
			size="1.375rem"
			stroke={1.5}
		/>
	);
}
