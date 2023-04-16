import { type SelectProps, Select } from '@mantine/core';

import styles from './control-dropdown.module.scss';

export interface DropdownItem {
	group?: string;
	label: string;
	value: string;
}

interface ControlDropdownProps extends SelectProps {
	title: string;
}

export default function ControlDropdown({
	data,
	disabled,
	label,
	title,
	value,
	onChange,
}: ControlDropdownProps): JSX.Element {
	return (
		<Select
			className={styles.dropdown}
			data={data}
			defaultValue={value}
			disabled={disabled}
			dropdownPosition="bottom"
			label={label}
			maxDropdownHeight={250}
			nothingFound={`No ${title} Found`}
			onChange={onChange}
			placeholder={`Select ${title}`}
			radius="md"
			searchable
			value={value}
		/>
	);
}
