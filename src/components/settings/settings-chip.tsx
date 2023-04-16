import { Chip } from '@mantine/core';

import styles from './settings-chip.module.scss';

interface SettingsChipProps {
	children: string | boolean | JSX.Element;
	checked: boolean;
	className?: string;
	onClick?: () => void;
}

export default function SettingsChip({
	children,
	checked,
	className = '',
	onClick,
}: SettingsChipProps): JSX.Element {
	return (
		<Chip
			className={`${styles.chip} ${className}`}
			checked={checked}
			color="gray"
			onClick={onClick}
			variant="filled"
		>
			{children}
		</Chip>
	);
}
