import { atom } from 'jotai';

export type ImageStatus = 'error' | 'ok' | 'refetch' | undefined;

export interface ImageLoaderStatusAtom {
	activeIndex: number | null;
	status: Record<string, ImageStatus>;
}

export const imageLoaderStatusAtom = atom<ImageLoaderStatusAtom>({
	activeIndex: null,
	status: {},
});

imageLoaderStatusAtom.onMount = (setAtom) => (): void => {
	setAtom({
		activeIndex: null,
		status: {},
	});
};
