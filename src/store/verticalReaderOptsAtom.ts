import { atomWithStorage } from 'jotai/utils';

export interface VerticalReaderOpts {
	direction: 'ltr' | 'rtl';
}

export const verticalReaderOptsAtom = atomWithStorage<VerticalReaderOpts>(
	'vertical-reader-opts',
	{
		direction: 'ltr',
	}
);
