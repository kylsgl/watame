'use client';

import { Fragment } from 'react';
import { useAtom } from 'jotai';
import { Container } from '@mantine/core';
import { ItemContentsModal } from '@/components/item';
import { globalOpenedModalAtom, searchOpenedUrlAtom } from '@/store';

import Library from '@/components/library/library';

export default function Home(): JSX.Element {
	const [globalOpenedModal, setGlobalOpenedModal] = useAtom(
		globalOpenedModalAtom
	);

	const [searchOpenedUrl] = useAtom(searchOpenedUrlAtom);

	const handleClose = (): void => {
		setGlobalOpenedModal('None');
	};

	return (
		<Fragment>
			<Container fluid mt="md" p="md">
				<Library />
			</Container>
			<ItemContentsModal
				url={searchOpenedUrl}
				opened={globalOpenedModal === 'Item'}
				onClose={handleClose}
			/>
		</Fragment>
	);
}
