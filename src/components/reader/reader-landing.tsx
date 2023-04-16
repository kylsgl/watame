import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { ActionIcon, Container, Title } from '@mantine/core';
import { type UniqueIdentifier } from '@dnd-kit/core';
import { IconLink, IconArrowRight } from '@tabler/icons-react';
import { isWebUri } from 'valid-url';

import { type SourcesStateAtomEntry, sourcesStateAtom } from '@/store';
import { TextInput } from '@/components/common';

import styles from './reader-landing.module.scss';

export default function ReaderLanding(): JSX.Element {
	const { push } = useRouter();

	const sources = useAtomValue(sourcesStateAtom);

	const sourcesHostnames: UniqueIdentifier[] = Object.values(sources).map(
		({ id }: SourcesStateAtomEntry): UniqueIdentifier => id
	);

	const [error, setError] = useState<string | undefined>();

	const handleChange = (): void => {
		setError(undefined);
	};

	const handleEnter = (value: string): void => {
		if (isWebUri(value) == null) {
			setError('Invalid URL');
			return;
		}

		const matchSourcesHostnames = new RegExp(sourcesHostnames.join('|'), 'gi');

		if (!matchSourcesHostnames.test(value)) {
			setError('URL source is not supported');
			return;
		}

		// Remove reader url
		const matchReaderURL = new RegExp(
			`https?://${window.location.host}/reader\\?chapter=`,
			'i'
		);

		const [chapter, page] = decodeURIComponent(
			value.replace(matchReaderURL, '')
		).split('#page=');

		push(
			{
				pathname: '/reader',
				query: { chapter },
				hash: `page=${(page as string | undefined) ?? 1}`,
			},
			undefined,
			{
				shallow: true,
			}
		).catch(console.warn);
	};

	return (
		<Container className={styles.cont} fluid>
			<div
				className={`${styles.container} ${
					error !== undefined ? styles.error : ''
				}`}
			>
				<Title
					className={styles.title}
					order={2}
				>{`wot's... uh to read?`}</Title>

				<TextInput
					className={styles.input}
					error={error}
					label="Enter Chapter URL"
					icon={<IconLink size={26} stroke={1.5} />}
					onChange={handleChange}
					onEnter={handleEnter}
					placeholder="Enter chapter URL"
					rightSection={
						<ActionIcon aria-label="Submit URL" size="lg">
							<IconArrowRight size={26} />
						</ActionIcon>
					}
				/>
			</div>
		</Container>
	);
}
