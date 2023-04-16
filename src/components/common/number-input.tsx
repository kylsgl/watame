import { useRef } from 'react';
import {
	type NumberInputHandlers,
	type NumberInputProps as MantineNumberInputProps,
	ActionIcon as MantineActionIcon,
	Group,
	NumberInput as MantineNumberInput,
} from '@mantine/core';

import styles from './number-input.module.scss';

interface NumberInputProps extends MantineNumberInputProps {
	controls?: boolean;
	decrementLabel: string;
	incrementLabel: string;
	onChange: (value: number) => void;
	value: number;
}

function ActionIcon(
	disabled: boolean,
	label: string,
	text: string,
	onClick: () => void
): JSX.Element {
	return (
		<MantineActionIcon
			aria-label={label}
			disabled={disabled}
			onClick={onClick}
			size={36}
			variant="default"
		>
			{text}
		</MantineActionIcon>
	);
}

export default function NumberInput({
	controls = true,
	decrementLabel,
	incrementLabel,
	max = 100,
	min = 1,
	onChange,
	step = 1,
	value: inputValue,
}: NumberInputProps): JSX.Element {
	const handlers = useRef<NumberInputHandlers>();

	const handleChange = (value: number | ''): void => {
		if (typeof value !== 'number' || value < min || value > max) {
			return;
		}

		onChange(value);
	};

	return (
		<Group className={styles.input} spacing={4}>
			{controls &&
				ActionIcon(inputValue <= min, decrementLabel, '-', (): void => {
					handlers.current?.decrement();
				})}

			<MantineNumberInput
				hideControls
				value={inputValue}
				onChange={handleChange}
				handlersRef={handlers}
				max={max}
				min={min}
				step={step}
			/>

			{controls &&
				ActionIcon(inputValue >= max, incrementLabel, '+', (): void => {
					handlers.current?.increment();
				})}
		</Group>
	);
}
