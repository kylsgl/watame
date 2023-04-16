import { useMantineColorScheme, ActionIcon, Tooltip } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

import { Switch } from '@/components/common';

import styles from './settings-item-dark-mode.module.scss';

import SettingsItem from '../settings-item';

interface SettingsItemDarkModeProps {
	compact?: boolean;
}

export default function SettingsItemDarkMode({
	compact = false,
}: SettingsItemDarkModeProps): JSX.Element {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	const isDark: boolean = colorScheme === 'dark';

	const handleClick = (): void => {
		toggleColorScheme();
	};

	const jsxCompact: JSX.Element = (
		<Tooltip
			arrowPosition="center"
			label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
			withArrow
		>
			<ActionIcon
				aria-label="Switch to Light/Dark Mode"
				className={styles.switch}
				onClick={handleClick}
				size="lg"
				variant="default"
			>
				{isDark ? (
					<IconSun size="1.125rem" stroke={1.5} />
				) : (
					<IconMoonStars size="1.125rem" stroke={1.5} />
				)}
			</ActionIcon>
		</Tooltip>
	);

	const jsxDefault: JSX.Element = (
		<SettingsItem title="Dark Mode" subtitle="Enable/disable dark mode">
			<Switch
				checked={isDark}
				label="Enable/disable dark mode"
				onChange={handleClick}
				onLabel="ON"
				offLabel="OFF"
				size="lg"
			/>
		</SettingsItem>
	);

	return compact ? jsxCompact : jsxDefault;
}
