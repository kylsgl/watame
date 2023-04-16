import { useAtom } from 'jotai';

import { type GlobalOpts, globalOptsAtom } from '@/store';
import { Switch } from '@/components/common';

import SettingsItem from '../settings-item';

export default function SettingsItemAnimations(): JSX.Element {
	const [{ animations }, setGlobalOpts] = useAtom(globalOptsAtom);

	const handleChange = (): void => {
		document.body.classList[animations ? 'add' : 'remove']('no-animations');

		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				animations: !current.animations,
			})
		);
	};

	return (
		<SettingsItem title="Animations" subtitle="Enable/disable animations">
			<Switch
				checked={animations}
				label="Enable/disable animations"
				onChange={handleChange}
				onLabel="ON"
				offLabel="OFF"
				size="lg"
			/>
		</SettingsItem>
	);
}
