import { Skeleton } from '@mantine/core';
import { IconAt, IconExternalLink } from '@tabler/icons-react';

import { useItemContentsQuery } from '@/hooks';
import { Modal } from '@/components/common';
import { sourcesInstances } from '@/services/sources';

import styles from './item-contents-modal.module.scss';

import ItemContents from './item-contents';

interface ItemContentsModalProps {
	url: string;
	opened: boolean;
	onClose: () => void;
}

export default function ItemContentsModal({
	opened,
	onClose,
	url,
}: ItemContentsModalProps): JSX.Element {
	const { fetchStatus, isError, isLoading, isSuccess, data } =
		useItemContentsQuery(true, url);

	const isReady =
		!(fetchStatus !== 'idle' || isError || isLoading) && isSuccess;

	const jsxTitle: JSX.Element = (
		<Skeleton visible={!isReady}>
			<div className={styles.title}>
				<IconAt size="1.125rem" />

				<span>{sourcesInstances[url]?.source.title}</span>

				<a href={url} rel="noopener noreferrer" tabIndex={-1} target="_blank">
					<IconExternalLink size="1.125rem" />
				</a>
			</div>
		</Skeleton>
	);

	return (
		<Modal
			className={styles.modal}
			onClose={onClose}
			opened={opened}
			title={jsxTitle}
		>
			<ItemContents
				// remove isReady; check param length instead
				details={data ?? {}}
				isReady={isReady}
				itemUrl={url}
			/>
		</Modal>
	);
}
