import {
	type SegmentedControlProps as MantineSegmentedControlProps,
	SegmentedControl as MantineSegmentedControl,
	Tooltip,
} from '@mantine/core';

import styles from './segmented-control.module.scss';

interface SegmentedControlProps extends MantineSegmentedControlProps {
	label?: string;
}

export default function SegmentedControl({
	className = '',
	data,
	label,
	onChange,
	value,
}: SegmentedControlProps): JSX.Element {
	return (
		<Tooltip
			arrowPosition="center"
			disabled={label === undefined}
			label={label}
			withArrow
		>
			<MantineSegmentedControl
				className={`${styles['segment-control']} ${className}`}
				data={data}
				defaultValue={value}
				onChange={onChange}
				value={value}
			/>
		</Tooltip>
	);
}
