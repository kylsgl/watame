import SettingsVerticalDirection from './settings-vertical-direction';

interface SettingsVerticalProps {
	className?: string;
}

export default function SettingsVertical({
	className = '',
}: SettingsVerticalProps): JSX.Element {
	return <SettingsVerticalDirection className={className} />;
}
