import type { FC } from 'react';
import type { ButtonProps } from '@mantine/core';
import type { TablerIconsProps } from '@tabler/icons-react';

export interface NavbarItemData {
	hidden?: boolean;
	icon: FC<TablerIconsProps>;
	label: string;
	link?: string;
	onClick?: () => void;
	variant?: ButtonProps['variant'];
}
