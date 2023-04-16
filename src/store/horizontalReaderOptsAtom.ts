import { atomWithStorage } from 'jotai/utils';

export interface HorizontalReaderOpts {
	alignCenter: boolean;
	direction: 'ltr' | 'rtl';
	offset: boolean;
	pages: number;
}

export const horizontalReaderOptsAtom = atomWithStorage<HorizontalReaderOpts>(
	'horizontal-reader-opts',
	{
		alignCenter: false,
		direction: 'ltr',
		offset: false,
		pages: 1,
	}
);
