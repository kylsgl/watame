import { type MutableRefObject, useEffect, useRef } from 'react';

export default function useIntersectionObserver<T extends HTMLElement>(
	options: IntersectionObserverInit,
	onIntersect: (element: T) => void,
	firstIntersect = false
): MutableRefObject<Array<T | null>> {
	const refs = useRef<Array<T | null>>([]);

	useEffect((): (() => void) => {
		const handleIntersectionObserver = (
			entries: IntersectionObserverEntry[]
		): void => {
			for (let idx = entries.length - 1; idx >= 0; idx -= 1) {
				if (entries[idx]?.isIntersecting) {
					onIntersect(entries[idx].target as T);

					if (firstIntersect) {
						return;
					}
				}
			}
		};

		const intersectionObserver = new IntersectionObserver(
			handleIntersectionObserver,
			options
		);

		refs.current.forEach((ref: HTMLElement | null): void => {
			if (ref != null) {
				intersectionObserver.observe(ref);
			}
		});

		return (): void => {
			intersectionObserver.disconnect();
		};
	}, [onIntersect, options, firstIntersect]);

	return refs;
}
