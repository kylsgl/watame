import { useAtom } from 'jotai';
import { Box, Group, SegmentedControl, Tooltip } from '@mantine/core';
import { IconArrowLeftTail, IconArrowRightTail } from '@tabler/icons-react';

import {
	type HorizontalReaderOpts,
	horizontalReaderOptsAtom,
} from '../../store';

interface SettingsHorizontalDirectionProps {
	className?: string;
}

export default function SettingsHorizontalDirection({
	className = '',
}: SettingsHorizontalDirectionProps): JSX.Element {
	const [horizontalReaderOpts, setHorizontalReaderOpts] = useAtom(
		horizontalReaderOptsAtom
	);
	const handleChange = (): void => {
		setHorizontalReaderOpts(
			(current): HorizontalReaderOpts => ({
				...current,
				direction: current.direction === 'ltr' ? 'rtl' : 'ltr',
			})
		);
	};

	return (
		<Tooltip arrowPosition="center" label="Reading direction" withArrow>
			<SegmentedControl
				className={className}
				data={[
					{
						value: 'rtl',
						label: (
							<Group noWrap spacing={5}>
								<IconArrowLeftTail size={15} />
								<Box>Right to Left</Box>
							</Group>
						),
					},
					{
						value: 'ltr',
						label: (
							<Group noWrap spacing={5}>
								<IconArrowRightTail size={15} />

								<Box>Left to Right</Box>
							</Group>
						),
					},
				]}
				defaultValue={horizontalReaderOpts.direction}
				onChange={handleChange}
				radius="sm"
				value={horizontalReaderOpts.direction}
			/>
		</Tooltip>
	);
}
