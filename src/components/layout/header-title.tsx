import { useAtomValue } from 'jotai';
import { Text } from '@mantine/core';

import { openedTitleAtom } from '../../store';

export default function HeaderTitle(): JSX.Element {
	const openedTitle = useAtomValue(openedTitleAtom);

	const {
		chapterUrls,
		current: { chapterIndex, chapterLabel, chapterUrl },
	} = openedTitle;

	const title: string =
		chapterUrl.length > 0
			? `${chapterLabel} [${chapterIndex + 1}/${chapterUrls.length}]`
			: 'watame';

	return <Text align="center">{title}</Text>;
}
