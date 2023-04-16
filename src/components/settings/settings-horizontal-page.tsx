import { useAtom } from 'jotai';
import { Slider } from '@mantine/core';

import {
	type HorizontalReaderOpts,
	horizontalReaderOptsAtom,
} from '../../store';

export interface SliderMarks {
	label: string;
	value: number;
}

interface SettingsHorizontalPageProps {
	className?: string;
	sliderMarks: SliderMarks[];
}

export default function SettingsHorizontalPage({
	className = '',
	sliderMarks,
}: SettingsHorizontalPageProps): JSX.Element {
	const [horizontalReaderOpts, setHorizontalReaderOpts] = useAtom(
		horizontalReaderOptsAtom
	);

	const handleChange = (value: number): void => {
		const pages: number = value <= 0 ? 1 : value;
		setHorizontalReaderOpts(
			(current): HorizontalReaderOpts => ({ ...current, pages })
		);
	};

	const handleLabel = (value: number): string | undefined =>
		sliderMarks.find((mark) => mark.value === value)?.label;

	return (
		<Slider
			className={className}
			color="dark"
			defaultValue={horizontalReaderOpts.pages}
			radius="md"
			label={handleLabel}
			step={1}
			marks={sliderMarks}
			max={5}
			min={0}
			value={horizontalReaderOpts.pages}
			styles={{ markLabel: { display: 'none' } }}
			onChangeEnd={handleChange}
		/>
	);
}
