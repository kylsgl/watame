import { Fragment } from 'react';
import SettingsVerticalDirection from './settings-vertical-direction';

interface SettingsVerticalProps {
	className?: string;
}

export default function SettingsVertical({
	className = '',
}: SettingsVerticalProps): JSX.Element {
	return (
		<Fragment>
			<SettingsVerticalDirection className={className} />
		</Fragment>
	);
}
