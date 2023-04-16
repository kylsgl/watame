import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { type FlateError, zip } from 'fflate';
import { IconDownload } from '@tabler/icons-react';

import { openedTitleAtom } from '../../store';

import ToolbarItem from './toolbar-item';
import { getFileNameFromUrl } from '../../lib/utils';
import Source from '../../services/sources/Source';

export default function ToolbarDownload(): JSX.Element {
	const openedTitle = useAtomValue(openedTitleAtom);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const save = (err: FlateError | null, data: Uint8Array): void => {
		if (err != null) {
			console.warn(err);
			return;
		}

		const a = document.createElement('a');
		a.href = URL.createObjectURL(
			new Blob([data], { type: 'application/octet-stream' })
		);
		a.download =
			`${openedTitle.itemTitle}_${openedTitle.current.chapterLabel}.zip`
				.replaceAll('[^a-zA-Z0-9-_\\.]', '_')
				.replaceAll(' ', '_');
		document.body.appendChild(a).click();
		a.remove();
	};

	const handleClick = async (): Promise<void> => {
		try {
			setIsLoading(true);

			const { pageUrls } = openedTitle.current;

			const buffers: ArrayBuffer[] = await Promise.all(
				pageUrls.map(async (url): Promise<ArrayBuffer> => {
					const response = await fetch(Source.proxy(url));
					return response.arrayBuffer();
				})
			);

			const files: Record<string, Uint8Array> = {};

			buffers.forEach((page, idx): void => {
				files[`${idx + 1}_${getFileNameFromUrl(pageUrls[idx]) ?? ''}`] =
					new Uint8Array(page);
			});

			zip(files, { level: 0 }, save);
		} catch (error) {
			console.warn(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ToolbarItem
			label={!isLoading ? 'Download chapter' : 'Downloading...'}
			Icon={IconDownload}
			isLoading={isLoading}
			onClick={!isLoading ? handleClick : undefined}
		/>
	);
}
