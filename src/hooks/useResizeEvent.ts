import { useEffect } from 'react';
import { useSetAtom } from 'jotai';

import { type GlobalOpts, globalOptsAtom } from '../store';

export default function useResizeEvent(): void {
	const setGlobalOpts = useSetAtom(globalOptsAtom);

	useEffect((): (() => void) => {
		const handleResize = (): void => {
			const { innerWidth } = window;

			if (innerWidth <= 668) {
				setGlobalOpts(
					(current): GlobalOpts => ({
						...current,
						layout: 'mobile',
						window: { width: innerWidth },
					})
				);
				return;
			}

			if (innerWidth <= 992) {
				setGlobalOpts(
					(current): GlobalOpts => ({
						...current,
						layout: 'desktop',
						navbarCollapsed: true,
						window: { width: innerWidth },
					})
				);
			}
		};

		handleResize();

		window.addEventListener('resize', handleResize);
		return (): void => {
			window.removeEventListener('resize', handleResize);
		};
	}, [setGlobalOpts]);
}
