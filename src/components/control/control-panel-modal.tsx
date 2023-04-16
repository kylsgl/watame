import { useAtom } from 'jotai';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';

import { globalOpenedModalAtom } from '@/store';
import { Modal } from '@/components/common';

import styles from './control-panel-modal.module.scss';

import ControlPanel from './control-panel';

interface ControlPanelModalProps {
	zIndex?: number;
}

export default function ControlPanelModal({
	zIndex,
}: ControlPanelModalProps): JSX.Element {
	const [globalOpenedModal, setGlobalOpenedModal] = useAtom(
		globalOpenedModalAtom
	);

	const handleClose = (): void => {
		setGlobalOpenedModal('None');
	};

	return (
		<Modal
			className={styles.modal}
			Icon={IconAdjustmentsHorizontal}
			onClose={handleClose}
			opened={globalOpenedModal === 'Controls'}
			scroll
			title="Controls"
			zIndex={zIndex}
		>
			<ControlPanel showDetails showSettings />
		</Modal>
	);
}
