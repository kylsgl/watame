import { useDeferredValue, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Group } from '@mantine/core';

import {
	horizontalReaderOptsAtom,
	openedTitleAtom,
	openedTitleCurrentPageAtom,
} from '@/store';
import { movePage } from '@/lib/utils';

import ControlArrow from './control-arrow';
import ControlDropdown, { type DropdownItem } from './control-dropdown';

function handleClickNext(): void {
	movePage('next');
}

function handleClickPrev(): void {
	movePage('prev');
}

function handleChange(idx: string | null): void {
	if (idx == null) {
		return;
	}

	movePage(Number(idx));
}

interface ControlPageSelectorProps {
	className?: string;
	disabled?: boolean;
}

export default function ControlPageSelector({
	className,
	disabled = false,
}: ControlPageSelectorProps): JSX.Element {
	const {
		current: { pageCount },
	} = useAtomValue(openedTitleAtom);

	const horizontalReaderOpts = useAtomValue(horizontalReaderOptsAtom);

	const openedTitleCurrentPage = useAtomValue(openedTitleCurrentPageAtom);

	const deferredOpenedTitleCurrentPage = useDeferredValue(
		openedTitleCurrentPage
	);

	const items: DropdownItem[] = useMemo(
		(): DropdownItem[] =>
			Array(pageCount)
				.fill(null)
				.map((_, idx): DropdownItem => {
					const page: number = idx + 1;
					return {
						label: `Page ${page}`,
						value: `${page}`,
					};
				})
				.reverse(),
		[pageCount]
	);

	const label: string =
		pageCount > 0
			? `Page ${deferredOpenedTitleCurrentPage} / ${pageCount}`
			: 'Page';

	return (
		<Group className={className} grow position="center" spacing="xs">
			<ControlArrow
				disabledNext={disabled || deferredOpenedTitleCurrentPage >= pageCount}
				disabledPrev={disabled || deferredOpenedTitleCurrentPage <= 1}
				labelNext="Go to next page"
				labelPrev="Go to previous page"
				middleElement={
					<ControlDropdown
						data={items}
						disabled={disabled}
						label={label}
						onChange={handleChange}
						title="Pages"
						value={`${deferredOpenedTitleCurrentPage}`}
					/>
				}
				onClickNext={handleClickNext}
				onClickPrev={handleClickPrev}
				reverse={horizontalReaderOpts.direction === 'rtl'}
			/>
		</Group>
	);
}
