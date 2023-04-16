import { type KeyboardEvent } from 'react';
import {
	type TextInputProps as MantineTextInputProps,
	TextInput as MantineTextInput,
	Tooltip,
} from '@mantine/core';

import styles from './text-input.module.scss';

interface TextInputProps extends MantineTextInputProps {
	error?: string;
	label: string;
	onEnter?: (value: string) => void;
}

export default function TextInput({
	className = '',
	error,
	icon,
	label,
	onChange,
	onEnter,
	placeholder,
	rightSection,
	size = 'lg',
	value,
}: TextInputProps): JSX.Element {
	const classNames = `
		${styles.input} 
		${error !== undefined ? styles.error : ''} 
		${className}
	`;

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === 'Enter' && onEnter !== undefined) {
			onEnter(event.currentTarget.value);
		}
	};

	return (
		<Tooltip
			disabled={error === undefined}
			label={error}
			opened={error !== undefined}
			position="bottom-start"
			withArrow
			zIndex={10}
		>
			<MantineTextInput
				aria-label={label}
				className={classNames}
				icon={icon}
				onChange={onChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				rightSection={rightSection}
				size={size}
				value={value}
			/>
		</Tooltip>
	);
}
