import {
	type SwitchProps as MantineSwitchProps,
	Switch as MantineSwitch,
} from '@mantine/core';

import styles from './switch.module.scss';

interface SwitchProps extends MantineSwitchProps {
	label?: string;
}

export default function Switch({
	checked,
	label,
	onChange,
	size = 'lg',
}: SwitchProps): JSX.Element {
	return (
		<MantineSwitch
			aria-label={label}
			aria-checked={checked}
			className={styles.switch}
			checked={checked}
			onChange={onChange}
			onLabel="ON"
			offLabel="OFF"
			size={size}
		/>
	);
}
