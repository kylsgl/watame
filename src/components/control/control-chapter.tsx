import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Group } from '@mantine/core';

import {
	globalOptsAtom,
	horizontalReaderOptsAtom,
	openedTitleAtom,
	verticalReaderOptsAtom,
} from '@/store';
import { moveChapter } from '@/lib/utils';

import ControlArrow from './control-arrow';
import ControlDropdown, { type DropdownItem } from './control-dropdown';

interface ControlChapterSelectorProps {
	className?: string;
	middleElement?: JSX.Element;
}

export default function ControlChapterSelector({
	className,
	middleElement,
}: ControlChapterSelectorProps): JSX.Element {
	const openedTitle = useAtomValue(openedTitleAtom);

	const { readerLayout } = useAtomValue(globalOptsAtom);
	const horizontalReaderOpts = useAtomValue(horizontalReaderOptsAtom);
	const verticalReaderOpts = useAtomValue(verticalReaderOptsAtom);

	const items: DropdownItem[] = useMemo((): DropdownItem[] => {
		const chaptersLength: number = openedTitle.chapters.length - 1;

		return openedTitle.chapters.map(
			({ group, label }, idx): DropdownItem => ({
				group,
				label,
				value: `${chaptersLength - idx}`,
			})
		);
	}, [openedTitle.chapters]);

	const label: string =
		openedTitle.chapterUrls.length > 0
			? `Chapter ${openedTitle.current.chapterIndex + 1} / ${
					openedTitle.chapterUrls.length
			  }`
			: 'Chapter';

	const handleClickNext = (): void => {
		moveChapter('next');
	};

	const handleClickPrev = (): void => {
		moveChapter('prev');
	};

	const handleChange = (idx: string | null): void => {
		if (idx == null) {
			return;
		}

		moveChapter(Number(idx), 'first');
	};

	return (
		<Group className={className} grow position="center" spacing="xs">
			<ControlArrow
				disabledNext={
					openedTitle.current.chapterIndex >= openedTitle.chapters.length - 1
				}
				disabledPrev={openedTitle.current.chapterIndex === 0}
				labelNext="Go to next chapter"
				labelPrev="Go to previous chapter"
				middleElement={
					middleElement ?? (
						<ControlDropdown
							data={items}
							label={label}
							onChange={handleChange}
							title="Chapters"
							value={`${openedTitle.current.chapterIndex}`}
						/>
					)
				}
				onClickNext={handleClickNext}
				onClickPrev={handleClickPrev}
				reverse={
					readerLayout === 'horizontal'
						? horizontalReaderOpts.direction === 'rtl'
						: verticalReaderOpts.direction === 'rtl'
				}
			/>
		</Group>
	);
}
