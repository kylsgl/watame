import {
	type BadgeProps as MantineBadgeProps,
	Badge as MantineBadge,
} from '@mantine/core';

import styles from './badge.module.scss';

interface BadgeProps extends MantineBadgeProps {}

export default function Badge({
	children,
	className = '',
	color,
	radius = 'sm',
	size = 'sm',
	variant = 'light',
}: BadgeProps): JSX.Element {
	return (
		<MantineBadge
			className={`${styles.badge} ${className}`}
			color={color}
			radius={radius}
			size={size}
			variant={variant}
		>
			{children}
		</MantineBadge>
	);
}
