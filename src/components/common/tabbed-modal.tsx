import { type FC, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
	type ModalBaseOverlayProps,
	type ModalProps as MantineModalProps,
	ActionIcon,
	Group,
	Modal as MantineModal,
	Tabs,
	Text,
	Tooltip,
} from '@mantine/core';
import { type TablerIconsProps, IconX } from '@tabler/icons-react';

import { globalOpenedModalAtom, globalOptsAtom } from '@/store';

import styles from './tabbed-modal.module.scss';

export interface TabItem {
	content: JSX.Element | JSX.Element[] | null;
	icon: FC<TablerIconsProps>;
	title: string;
	value: string;
}

export interface TabData {
	defaultValue: string;
	items: TabItem[];
}

interface ModalProps extends Omit<MantineModalProps, 'onClose'> {
	data: TabData;
	onClose?: () => void;
	withTooltip?: boolean;
}

export function TabbedModal({
	className = '',
	data: { defaultValue, items },
	lockScroll = false,
	onClose,
	opened,
	withTooltip = false,
	zIndex,
}: ModalProps): JSX.Element {
	const setGlobalOpenedModal = useSetAtom(globalOpenedModalAtom);

	const { colorScheme, layout } = useAtomValue(globalOptsAtom);

	const isDark: boolean = colorScheme === 'dark';

	const overlayProps: ModalBaseOverlayProps = {
		blur: isDark ? 0.8 : 0.4,
		opacity: isDark ? 0.8 : 0.4,
	};

	const handleClose = useCallback((): void => {
		setGlobalOpenedModal('None');
	}, [setGlobalOpenedModal]);

	const jsxTabs: JSX.Element[] = items.map(
		({ icon: Icon, title, value }): JSX.Element => {
			const jsxTab: JSX.Element = (
				<Tabs.Tab
					aria-label={title}
					className={styles['tab-icon']}
					key={`tab-${value}`}
					value={value}
				>
					<Icon size="1.375rem" stroke={1.5} />
				</Tabs.Tab>
			);

			return withTooltip ? (
				<Tooltip key={`tab-${value}`} label={title} withArrow>
					{jsxTab}
				</Tooltip>
			) : (
				jsxTab
			);
		}
	);

	const jsxPanels: JSX.Element[] = items.map(
		({ content, title, value }): JSX.Element => (
			<Tabs.Panel
				className={styles['tab-panel']}
				data-tab-panel=""
				key={`panel-${value}`}
				value={value}
			>
				<Group className={styles.header} position="apart">
					<Text size="md" weight={500}>
						{title}
					</Text>
					<ActionIcon
						aria-label="Close modal"
						onClick={handleClose}
						variant="transparent"
					>
						<IconX size="1rem" stroke={1.5} />
					</ActionIcon>
				</Group>

				{content}
			</Tabs.Panel>
		)
	);

	return (
		<MantineModal
			centered
			className={`
				${styles.modal}
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
			withCloseButton={false}
			zIndex={zIndex ?? 10 /** 210 */}
		>
			<Tabs
				variant="outline"
				orientation="vertical"
				defaultValue={defaultValue}
				className={styles.tabs}
				role="tabs"
			>
				<Tabs.List className={styles['tabs-container']}>{jsxTabs}</Tabs.List>
				{jsxPanels}
			</Tabs>
		</MantineModal>
	);
}
