import { IconPlayerPlay } from '@tabler/icons-react';

import ToolbarItem from './toolbar-item';

export default function ToolbarAutoplay(): JSX.Element {
	return (
		<ToolbarItem
			disabled
			label="Autoplay"
			Icon={IconPlayerPlay}
			// onClick={onClickHandler}
		/>
	);
}
