import { useAtom } from 'jotai';
import { Box, Group, SegmentedControl, Tooltip } from '@mantine/core';
import { IconArrowLeftTail, IconArrowRightTail } from '@tabler/icons-react';

import { type VerticalReaderOpts, verticalReaderOptsAtom } from '../../store';

interface SettingsVerticalDirectionProps {
	className?: string;
}

export default function SettingsVerticalDirection({
	className = '',
}: SettingsVerticalDirectionProps): JSX.Element {
	const [verticalReaderOpts, setVerticalReaderOpts] = useAtom(
		verticalReaderOptsAtom
	);
	const handleChange = (): void => {
		setVerticalReaderOpts(
			(current): VerticalReaderOpts => ({
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
				defaultValue={verticalReaderOpts.direction}
				onChange={handleChange}
				radius="sm"
				value={verticalReaderOpts.direction}
			/>
		</Tooltip>
	);
}
