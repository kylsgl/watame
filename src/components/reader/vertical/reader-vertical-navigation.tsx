import { Fragment } from 'react';

import { useAtomValue } from 'jotai';

import { globalOptsAtom } from '@/store';

import ControlChapterSelector from '../../control/control-chapter';
import NavbarControlButton from '../../navbar/navbar-control-button';

interface ReaderVerticalNavigationProps {
	className?: string;
}

export default function ReaderVerticalNavigation({
	className = '',
}: ReaderVerticalNavigationProps): JSX.Element {
	const { layout } = useAtomValue(globalOptsAtom);

	return (
		<ControlChapterSelector
			className={className}
			middleElement={
				layout === 'mobile' ? (
					<NavbarControlButton collapsed />
				) : (
					<Fragment></Fragment>
				)
			}
		/>
	);
}
