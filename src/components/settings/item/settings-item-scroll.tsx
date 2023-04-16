import { useAtom } from 'jotai';

import { type GlobalOpts, globalOptsAtom } from '@/store';
import { NumberInput } from '@/components/common';

import SettingsItem from '../settings-item';

enum ScrollFrameRateLimit {
	max = 500,
	min = 30,
}

enum ScrollSpeedLimit {
	max = 100,
	min = 0,
}

export default function SettingsItemScroll(): JSX.Element {
	const [
		{
			scrollFrameRate,
			scrollSpeed,
			window: { width },
		},
		setGlobalOpts,
	] = useAtom(globalOptsAtom);

	const handleFrameRateChange = (value: number): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				scrollFrameRate: value,
			})
		);
	};

	const handleSpeedChange = (value: number): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				scrollSpeed: value,
			})
		);
	};

	return (
		<SettingsItem
			group
			title="Keyboard Scroll"
			subtitle="Modify vertical and horizontal scrolling speed and frame rate"
		>
			<SettingsItem
				title="Frame Rate"
				text={`(min: ${ScrollFrameRateLimit.min}, max: ${ScrollFrameRateLimit.max})`}
			>
				<NumberInput
					controls={width > 768}
					decrementLabel="Decrement scroll frame rate"
					incrementLabel="Increment scroll frame rate"
					max={ScrollFrameRateLimit.max}
					min={ScrollFrameRateLimit.min}
					onChange={handleFrameRateChange}
					step={1}
					value={scrollFrameRate}
				/>
			</SettingsItem>

			<SettingsItem
				title="Speed"
				text={`(min: ${ScrollSpeedLimit.min}, max: ${ScrollSpeedLimit.max})`}
			>
				<NumberInput
					controls={width > 768}
					decrementLabel="Decrement scroll speed"
					incrementLabel="Increment scroll speed"
					max={ScrollSpeedLimit.max}
					min={ScrollSpeedLimit.min}
					onChange={handleSpeedChange}
					step={1}
					value={scrollSpeed}
				/>
			</SettingsItem>
		</SettingsItem>
	);
}
