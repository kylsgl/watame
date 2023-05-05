'use client';

import { Fragment } from 'react';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { LoadingOverlay } from '@mantine/core';

import { openedTitleAtom } from '@/store';
import useChapterEvents from '@/hooks/useChapterEvents';
import { Reader, ReaderLanding } from '@/components/reader';
import { getCurrentPageNumber } from '@/lib/utils';

import ControlPanelModal from '../components/control/control-panel-modal';

const jsxModalWrapper = (
	element: JSX.Element,
	zIndex?: number
): JSX.Element => (
	<>
		{element}
		<ControlPanelModal zIndex={zIndex} />
	</>
);

export default function ReaderPage(): JSX.Element {
	const { itemUrl } = useAtomValue(openedTitleAtom);

	useChapterEvents();

	const {
		query: { chapter },
	} = useRouter();

	const chapterUrl: string = typeof chapter === 'string' ? chapter.trim() : '';

	if (chapterUrl.length <= 0 || chapterUrl === 'none') {
		if (itemUrl.length > 0 && chapterUrl !== 'none') {
			window.dispatchEvent(new Event('chapter:current'));
			return jsxModalWrapper(
				<LoadingOverlay
					id="loading-overlay"
					overlayBlur={1}
					overlayOpacity={0.1}
					visible
				/>,
				450
			);
		}

		return <ReaderLanding />;
	}

	return jsxModalWrapper(
		<Reader chapterUrl={chapterUrl} chapterPage={getCurrentPageNumber()} />
	);
}
