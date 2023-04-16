import { type FC } from 'react';
import {
	type ActionIconProps,
	ActionIcon,
	Group,
	Tooltip,
} from '@mantine/core';
import {
	type TablerIconsProps,
	IconArrowLeft,
	IconArrowRight,
} from '@tabler/icons-react';

function Arrow(
	disabled: boolean,
	Icon: FC<TablerIconsProps>,
	label: string,
	onClick: () => void,
	tooltip: boolean,
	variant: ActionIconProps['variant']
): JSX.Element {
	return (
		<Tooltip
			arrowPosition="center"
			disabled={disabled || !tooltip}
			label={label}
			withArrow
		>
			<span>
				<ActionIcon
					aria-label={label}
					disabled={disabled}
					onClick={onClick}
					py="lg"
					radius="md"
					size="xl"
					variant={variant}
				>
					<Icon size={20} />
				</ActionIcon>
			</span>
		</Tooltip>
	);
}

interface ControlArrowProps {
	className?: string;
	disabledNext?: boolean;
	disabledPrev?: boolean;
	labelNext?: string;
	labelPrev?: string;
	middleElement: JSX.Element;
	onClickNext: () => void;
	onClickPrev: () => void;
	reverse?: boolean;
	tooltip?: boolean;
	variant?: ActionIconProps['variant'];
}

export default function ControlArrow({
	className = '',
	disabledNext = false,
	disabledPrev = false,
	labelPrev = '',
	labelNext = '',
	middleElement,
	onClickNext,
	onClickPrev,
	reverse = false,
	tooltip = true,
	variant = 'default',
}: ControlArrowProps): JSX.Element {
	const jsxNext: JSX.Element = Arrow(
		disabledNext,
		reverse ? IconArrowLeft : IconArrowRight,
		labelNext,
		onClickNext,
		tooltip,
		variant
	);

	const jsxPrevious: JSX.Element = Arrow(
		disabledPrev,
		reverse ? IconArrowRight : IconArrowLeft,
		labelPrev,
		onClickPrev,
		tooltip,
		variant
	);

	return (
		<Group className={className} spacing="xs" noWrap>
			{reverse ? jsxNext : jsxPrevious}
			{middleElement}
			{reverse ? jsxPrevious : jsxNext}
		</Group>
	);
}
