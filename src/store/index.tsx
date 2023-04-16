import { atom } from 'jotai';

export * from './cacheAtom';
export * from './globalOptsAtom';
export * from './horizontalReaderOptsAtom';
export * from './imageLoaderStatusAtom';
export * from './libraryAtom';
export * from './openedTitleAtom';
export * from './searchAtom';
export * from './sourcesAtom';
export * from './verticalReaderOptsAtom';

export const drawerAtom = atom<boolean>(false);

export const globalOpenedModalAtom = atom<
	'Item' | 'Controls' | 'Settings' | 'None'
>('None');
