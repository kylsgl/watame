import { Group } from '@mantine/core';
import ToolbarDownload from './toolbar-download';
import ToolbarCopy from './toolbar-copy';
import ToolbarFullscreen from './toolbar-fullscreen';
import ToolbarAutoplay from './toolbar-autoplay';

export default function Toolbar(): JSX.Element {
	return (
		<Group noWrap position="apart" spacing="xs">
			<ToolbarDownload />
			<ToolbarCopy />
			<ToolbarAutoplay />
			<ToolbarFullscreen />
		</Group>
	);
}
