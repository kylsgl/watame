import { useAtom } from 'jotai';

import { type GlobalOpts, globalOptsAtom } from '@/store';
import { NumberInput } from '@/components/common';

import SettingsItem from '../settings-item';

enum Preload {
	max = 5,
	min = 0,
}

export default function SettingsItemPreload(): JSX.Element {
	const [globalOpts, setGlobalOpts] = useAtom(globalOptsAtom);

	return (
		<SettingsItem
			title="Preload Pages"
			subtitle="Number of pages to preload"
			text={`(min: ${Preload.min}, max: ${Preload.max})`}
		>
			<NumberInput
				controls={globalOpts.window.width > 768}
				decrementLabel="Decrement pages to preload"
				incrementLabel="Increment pages to preload"
				max={Preload.max}
				min={Preload.min}
				onChange={(value: number): void => {
					setGlobalOpts(
						(current): GlobalOpts => ({
							...current,
							preloadPage: value,
						})
					);
				}}
				step={1}
				value={globalOpts.preloadPage}
			/>
		</SettingsItem>
	);
}
