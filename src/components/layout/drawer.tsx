import { useAtom } from 'jotai';
import { Drawer as MantineDrawer } from '@mantine/core';
import { drawerAtom } from '@/store';
import { NAVBAR_WIDTH } from '@/constants';

import styles from './drawer.module.scss';

import Navbar from '../navbar/navbar';

interface DrawerProps {
	collapsed?: boolean;
	collapsible?: boolean;
	onCollapseClick: () => void;
	width: number;
}

export default function Drawer({
	collapsed = false,
	collapsible = false,
	onCollapseClick,
	width,
}: DrawerProps): JSX.Element {
	const [drawer, setDrawer] = useAtom(drawerAtom);

	const handleClose = (): void => {
		setDrawer(false);
	};

	return (
		<MantineDrawer
			closeOnClickOutside
			closeOnEscape
			lockScroll={false}
			onClose={handleClose}
			opened={drawer}
			overlayProps={{
				blur: 0.25,
				opacity: 0.25,
			}}
			padding={0}
			scrollAreaComponent={MantineDrawer.NativeScrollArea}
			size={NAVBAR_WIDTH}
			withCloseButton={false}
		>
			<Navbar
				className={styles.drawer}
				drawer
				collapsed={collapsed}
				collapsible={collapsible}
				onCollapseClick={onCollapseClick}
				width={width}
			/>
		</MantineDrawer>
	);
}
