import { IconLink } from '@tabler/icons-react';

import ToolbarItem from './toolbar-item';

export default function ToolbarCopy(): JSX.Element {
	const handleClick = (): void => {
		navigator.clipboard.writeText(window.location.href).catch(console.warn);
	};

	return (
		<ToolbarItem
			label="Copy chapter URL"
			Icon={IconLink}
			onClick={handleClick}
		/>
	);
}
