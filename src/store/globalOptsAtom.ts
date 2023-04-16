import { atomWithStorage } from 'jotai/utils';
import { type ColorScheme } from '@mantine/core';

export interface GlobalOpts {
	animations: boolean;
	colorScheme: ColorScheme;
	layout: 'desktop' | 'mobile';
	navbarCollapsed: boolean;
	preloadPage: number;
	readerLayout: 'horizontal' | 'vertical';
	scrollFrameRate: number;
	scrollSpeed: number;
	window: {
		width: number;
	};
}

export const globalOptsAtom = atomWithStorage<GlobalOpts>('global-opts', {
	animations: true,
	colorScheme: 'light',
	layout: 'desktop',
	navbarCollapsed: false,
	preloadPage: 2,
	readerLayout: 'horizontal',
	scrollFrameRate: 144,
	scrollSpeed: 30,
	window: {
		width: 992,
	},
});
