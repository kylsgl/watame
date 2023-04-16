import { useState } from 'react';
import { type UniqueIdentifier } from '@dnd-kit/core';
import { Checkbox, Group, Text, UnstyledButton } from '@mantine/core';

import { Badge } from '@/components/common';
import { ImageElement } from '@/components/image';

import styles from './settings-sources-item.module.scss';

interface SettingSourcesItemProps {
	className?: string;
	dragHandle: JSX.Element;
	enabled: boolean;
	icon: string;
	id: UniqueIdentifier;
	onCheck: (id: SettingSourcesItemProps['id'], value: boolean) => void;
	tags: string[];
	title: string;
}

export default function SettingSourcesItem({
	className = '',
	dragHandle,
	enabled,
	icon,
	id,
	onCheck,
	tags,
	title,
}: SettingSourcesItemProps): JSX.Element {
	const [check, setCheck] = useState<boolean>(enabled);

	const handleCheck = (): void => {
		setCheck(!check);
		onCheck(id, !check);
	};

	const jsxTags: JSX.Element[] = tags.map(
		(tag: string): JSX.Element => (
			<Badge className={styles.tag} key={tag} radius="sm" size="md">
				{tag.toLowerCase()}
			</Badge>
		)
	);

	return (
		<UnstyledButton
			aria-label={`Enable/disable ${title}`}
			className={`${styles.item} ${className}`}
			onClick={handleCheck}
		>
			{dragHandle}

			<Group className={styles.details}>
				<ImageElement
					alt={`${title} icon`}
					className={styles.icon}
					src={icon}
				/>

				<div>
					<Text weight={500} mb={7} sx={{ lineHeight: 1 }}>
						{title}
					</Text>
					<Text size="sm" color="dimmed">
						{jsxTags}
					</Text>
				</div>
			</Group>

			<Checkbox
				checked={check}
				className={styles['check-box']}
				onChange={handleCheck}
				size="md"
				tabIndex={-1}
			/>
		</UnstyledButton>
	);
}
