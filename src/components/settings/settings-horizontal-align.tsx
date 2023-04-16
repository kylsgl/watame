import { useAtom } from 'jotai';

import {
	type HorizontalReaderOpts,
	horizontalReaderOptsAtom,
} from '../../store';

import SettingsChip from './settings-chip';

interface SettingsHorizontalAlignProps {
	className?: string;
}

export default function SettingsHorizontalAlign({
	className = '',
}: SettingsHorizontalAlignProps): JSX.Element {
	const [horizontalReaderOpts, setHorizontalReaderOpts] = useAtom(
		horizontalReaderOptsAtom
	);

	const handleClick = (): void => {
		setHorizontalReaderOpts(
			(current): HorizontalReaderOpts => ({
				...current,
				alignCenter: !current.alignCenter,
			})
		);
	};

	return (
		<SettingsChip
			checked={horizontalReaderOpts.alignCenter}
			className={className}
			onClick={handleClick}
		>
			Center Pages
		</SettingsChip>
	);
}
