import { IconTrash } from '@tabler/icons-react';

import styles from './toolbar-remove.module.scss';

import ToolbarItem from './toolbar-item';

export default function ToolbarRemove(): JSX.Element {
	const handleClick = (): void => {
		window.dispatchEvent(new Event('chapter:remove'));
	};

	return (
		<ToolbarItem
			className={styles.remove}
			Icon={IconTrash}
			label="Remove Chapter"
			onClick={handleClick}
			withText
		/>
	);
}
