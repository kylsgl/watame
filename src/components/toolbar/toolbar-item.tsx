import { type FC } from 'react';
import { ActionIcon, Loader, Tooltip } from '@mantine/core';
import { type TablerIconsProps } from '@tabler/icons-react';

import styles from './toolbar-item.module.scss';

interface ToolbarItemProps {
	className?: string;
	disabled?: boolean;
	Icon: FC<TablerIconsProps>;
	isLoading?: boolean;
	label: string;
	onClick?: () => Promise<void> | void;
	withText?: boolean;
}

export default function ToolbarItem({
	className = '',
	disabled = false,
	Icon,
	isLoading = false,
	label,
	onClick,
	withText = false,
}: ToolbarItemProps): JSX.Element {
	const jsxIcon = (text?: string): JSX.Element => (
		<ActionIcon
			aria-label={label}
			className={`${styles.button} ${withText ? styles.text : ''} ${className}`}
			// color='gray'
			disabled={disabled}
			onClick={onClick}
			variant="light"
		>
			{!isLoading && <Icon size={18} />}
			{isLoading && <Loader size="xs" />}
			{text != null && <span>{text}</span>}
		</ActionIcon>
	);

	return withText ? (
		jsxIcon(label)
	) : (
		<Tooltip arrowPosition="center" disabled={disabled} label={label} withArrow>
			{jsxIcon()}
		</Tooltip>
	);
}
