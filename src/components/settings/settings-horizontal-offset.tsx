import { useAtom } from 'jotai';

import {
	type HorizontalReaderOpts,
	horizontalReaderOptsAtom,
} from '../../store';

import SettingsChip from './settings-chip';

interface SettingsHorizontalOffsetProps {
	className?: string;
}

export default function SettingsHorizontalOffset({
	className = '',
}: SettingsHorizontalOffsetProps): JSX.Element {
	const [horizontalReaderOpts, setHorizontalReaderOpts] = useAtom(
		horizontalReaderOptsAtom
	);

	const handleClick = (): void => {
		setHorizontalReaderOpts(
			(current): HorizontalReaderOpts => ({
				...current,
				offset: !current.offset,
			})
		);
	};

	return (
		<SettingsChip
			checked={horizontalReaderOpts.offset}
			className={className}
			onClick={handleClick}
		>
			Offset Page
		</SettingsChip>
	);
}
