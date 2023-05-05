import { type FC, Fragment } from 'react';
import { useAtomValue } from 'jotai';
import { ActionIcon } from '@mantine/core';
import {
	type TablerIconsProps,
	IconChevronLeft,
	IconChevronRight,
} from '@tabler/icons-react';

import { type HorizontalReaderOpts, openedTitleAtom } from '@/store';
import { getCurrentPageNumber, moveChapter, movePage } from '@/lib/utils';

import styles from './reader-horizontal-navigation.module.scss';

interface ReaderHorizontalNavigationProps
	extends Pick<HorizontalReaderOpts, 'pages'> {
	isLTR: boolean;
}

export default function ReaderHorizontalNavigation({
	isLTR,
	pages,
}: ReaderHorizontalNavigationProps): JSX.Element {
	const {
		current: { pageCount },
	} = useAtomValue(openedTitleAtom);

	const handleClickNext = (): void => {
		const page: number = getCurrentPageNumber();

		if (page > pageCount - pages) {
			moveChapter('next');
			return;
		}

		movePage('next');
	};

	const handleClickPrev = (): void => {
		const page: number = getCurrentPageNumber();

		if (page <= pages) {
			moveChapter('prev', 'last');
			return;
		}

		movePage('prev');
	};

	const jsxArrow = (
		className: string,
		Icon: FC<TablerIconsProps>,
		label: string,
		onClick: () => void
	): JSX.Element => (
		<ActionIcon
			aria-label={label}
			className={`${styles.button} ${className}`}
			color="pink"
			onClick={onClick}
			radius="xl"
			size="xl"
			variant="transparent"
		>
			<Icon />
		</ActionIcon>
	);

	return (
		<>
			{jsxArrow(
				styles.left,
				IconChevronLeft,
				isLTR ? 'Go to previous chapter' : 'Go to next chapter',
				isLTR ? handleClickPrev : handleClickNext
			)}

			{jsxArrow(
				styles.right,
				IconChevronRight,
				isLTR ? 'Go to next chapter' : 'Go to previous chapter',
				isLTR ? handleClickNext : handleClickPrev
			)}
		</>
	);
}
