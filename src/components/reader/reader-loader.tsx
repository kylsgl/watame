import { useEffect } from 'react';

import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';

import { openedTitleAtom, openedTitleCurrentPageAtom } from '@/store';

export default function ReaderLoader(): null {
	const {
		current: { chapterUrl },
	} = useAtomValue(openedTitleAtom);

	const openedTitleCurrentPage = useAtomValue(openedTitleCurrentPageAtom);

	const { push } = useRouter();

	useEffect((): (() => void) => {
		const loadCurrent = (): void => {
			if (chapterUrl.length <= 0) {
				return;
			}

			push(
				{
					pathname: '/reader',
					query: { chapter: chapterUrl },
					hash: `page=${openedTitleCurrentPage}`,
				},
				undefined,
				{ scroll: true, shallow: true }
			).catch(console.warn);
		};

		window.addEventListener('chapter:current', loadCurrent);
		return (): void => {
			window.removeEventListener('chapter:current', loadCurrent);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chapterUrl, push]);

	return null;
}
