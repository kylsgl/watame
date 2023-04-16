import { type FC } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
	type ModalBaseOverlayProps,
	type ModalProps as MantineModalProps,
	Group,
	Modal as MantineModal,
	Text,
} from '@mantine/core';
import { type TablerIconsProps } from '@tabler/icons-react';

import { globalOpenedModalAtom, globalOptsAtom } from '@/store';

import styles from './modal.module.scss';

interface ModalProps extends Omit<MantineModalProps, 'onClose'> {
	Icon?: FC<TablerIconsProps>;
	onClose?: () => void;
	scroll?: boolean;
}

export default function Modal({
	children,
	className = '',
	Icon,
	lockScroll = false,
	onClose,
	opened,
	scroll = false,
	title,
	zIndex,
}: ModalProps): JSX.Element {
	const setGlobalOpenedModal = useSetAtom(globalOpenedModalAtom);

	const { colorScheme, layout } = useAtomValue(globalOptsAtom);

	const isDark: boolean = colorScheme === 'dark';

	const overlayProps: ModalBaseOverlayProps = {
		blur: isDark ? 0.8 : 0.4,
		opacity: isDark ? 0.8 : 0.4,
	};

	const handleClose = (): void => {
		setGlobalOpenedModal('None');
	};

	const jsxTitle: JSX.Element = (
		<Group noWrap spacing="xs">
			{Icon !== undefined && <Icon size={22} />}
			<Text size="md" weight={500}>
				{title}
			</Text>
		</Group>
	);

	return (
		<MantineModal
			centered
			className={`
				${styles.modal} 
				${scroll ? styles.scroll : ''} 
				${layout === 'desktop' ? styles.desktop : styles.mobile} 
				${className}
			`}
			closeButtonProps={{ 'aria-label': 'Close modal' }}
			lockScroll={lockScroll}
			onClose={onClose ?? handleClose}
			opened={opened}
			overlayProps={overlayProps}
			scrollAreaComponent={MantineModal.NativeScrollArea}
			size="auto"
			transitionProps={{
				duration: 400,
				transition: 'slide-up',
			}}
			title={typeof title === 'string' ? jsxTitle : title}
			zIndex={zIndex ?? 10 /** 210 */}
		>
			{children}
		</MantineModal>
	);
}
