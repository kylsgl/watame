import { Alert, Button, Code, Flex, Group } from '@mantine/core';
import {
	IconAlertCircle,
	IconReload,
	IconExternalLink,
} from '@tabler/icons-react';

import Source from '@/services/sources/Source';
import { getFileNameFromUrl } from '@/lib/utils';

import styles from './image-error.module.scss';

interface ImageErrorProps {
	id?: string;

	onClick: () => void;
	url: string;
}

export default function ImageError({
	id,
	onClick,
	url,
}: ImageErrorProps): JSX.Element {
	const imageName: string = getFileNameFromUrl(url) ?? 'Image';

	const matchServers = new RegExp(Source.PROXIES.servers.join('|'), 'gi');

	const matchCloudflareMirage = /\/cdn.+?(?=https:)/g;

	const cleanUrl: string = url
		.replaceAll(matchServers, '')
		.replaceAll(matchCloudflareMirage, '');

	return (
		<Alert
			className={styles['image-error']}
			color="red"
			icon={<IconAlertCircle size={20} />}
			id={id}
			title={`${imageName} failed to load`}
			variant="outline"
		>
			<Flex
				gap="sm"
				justify="flex-start"
				align="flex-start"
				direction="column"
				wrap="nowrap"
			>
				<span>An error occurred while loading this image.</span>
				<Code block>{cleanUrl}</Code>

				<Group spacing="xs">
					<Button
						color="green"
						compact
						leftIcon={<IconReload size={15} />}
						variant="light"
						onClick={onClick}
					>
						Reload
					</Button>

					<a href={cleanUrl} target="_blank" rel="noopener noreferrer">
						<Button
							color="blue"
							compact
							leftIcon={<IconExternalLink size={15} />}
							variant="light"
						>
							Visit Link
						</Button>
					</a>
				</Group>
			</Flex>
		</Alert>
	);
}
