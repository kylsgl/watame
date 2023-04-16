import { Fragment } from 'react';

import SettingsHorizontalDirection from './settings-horizontal-direction';
import SettingsHorizontalPage, {
	type SliderMarks,
} from './settings-horizontal-page';
import SettingsHorizontalAlign from './settings-horizontal-align';
import SettingsHorizontalOffset from './settings-horizontal-offset';

const SLIDER_MARKS: SliderMarks[] = [
	{ value: 1, label: '1 page' },
	{ value: 2, label: '2 pages' },
	{ value: 3, label: '3 pages' },
	{ value: 4, label: '4 pages' },
];

interface SettingsHorizontalProps {
	className?: string;
}

export default function SettingsHorizontal({
	className = '',
}: SettingsHorizontalProps): JSX.Element {
	return (
		<Fragment>
			<SettingsHorizontalDirection className={className} />
			<SettingsHorizontalPage
				className={className}
				sliderMarks={SLIDER_MARKS}
			/>
			<SettingsHorizontalAlign className={className} />
			<SettingsHorizontalOffset className={className} />
		</Fragment>
	);
}
