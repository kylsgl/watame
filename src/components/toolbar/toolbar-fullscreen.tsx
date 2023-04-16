import { IconArrowsMaximize } from '@tabler/icons-react';

import ToolbarItem from './toolbar-item';

export default function ToolbarFullscreen(): JSX.Element {
	const handleClick = (): void => {
		document.body.requestFullscreen().catch(console.warn);
	};

	return (
		<ToolbarItem
			label="Fullscreen"
			Icon={IconArrowsMaximize}
			onClick={handleClick}
		/>
	);
}
