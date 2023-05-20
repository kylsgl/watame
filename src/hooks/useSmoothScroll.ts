import { useEffect } from 'react';

interface Key {
	action: () => void;
	animation: number | null;
}

type KeyEntry = [KeyboardEvent['code'], Key];

type Keys = Record<KeyboardEvent['code'], Key>;

interface KeyBinds {
	Up?: KeyboardEvent['code'];
	Down?: KeyboardEvent['code'];
	Left?: KeyboardEvent['code'];
	Right?: KeyboardEvent['code'];
}

export default function useSmoothScroll(
	keyBinds: KeyBinds,
	steps: number,
	framerate: number
): void {
	useEffect((): (() => void) | undefined => {
		let frame = 0;

		if (steps <= 0) {
			return undefined;
		}

		const keys: Keys = Object.fromEntries(
			Object.entries(keyBinds)
				.map(([direction, code]): KeyEntry | null => {
					if (typeof code !== 'string' || code.length <= 0) {
						return null;
					}

					let action: Key['action'] = (): void => {};

					switch (direction as keyof KeyBinds) {
						case 'Up': {
							action = (): void => {
								window.scroll(window.scrollX, window.scrollY - frame);
							};
							break;
						}
						case 'Down': {
							action = (): void => {
								window.scroll(window.scrollX, window.scrollY + frame);
							};
							break;
						}
						case 'Left': {
							action = (): void => {
								window.scroll(window.scrollX - frame, window.scrollY);
							};
							break;
						}
						case 'Right': {
							action = (): void => {
								window.scroll(window.scrollX + frame, window.scrollY);
							};
							break;
						}
						default:
							break;
					}

					return [
						code,
						{
							action,
							animation: null,
						},
					];
				})
				.filter(
					(keyBind: KeyEntry | null): keyBind is KeyEntry => keyBind !== null
				)
		);

		const clearAnimations = (): void => {
			Object.keys(keys).forEach((key: KeyboardEvent['code']): void => {
				const { animation } = keys[key];
				if (animation == null) {
					return;
				}

				cancelAnimationFrame(animation);
				keys[key].animation = null;
			});
		};

		const scroll = (key: string): void => {
			let next = 0;
			const interval: number = 1000 / framerate;

			const animation = (timestamp: number): void => {
				keys[key].animation = requestAnimationFrame(animation);

				const delta: number = timestamp - next;

				if (delta >= interval) {
					if (frame < steps) {
						frame += steps * 0.075;
					} else if (frame > steps) {
						frame = steps;
					}

					keys[key].action();

					next = timestamp - (delta % interval);
				}
			};

			keys[key].animation = requestAnimationFrame(animation);
		};

		const handleKeyDown = (event: KeyboardEvent): void => {
			const { code } = event;

			if (!(code in keys)) {
				return;
			}

			event.preventDefault();

			if (keys[code].animation !== null || !event.defaultPrevented) {
				return;
			}

			scroll(code);
		};

		const handleKeyUp = (event: KeyboardEvent): void => {
			const { code } = event;

			if (!(code in keys)) {
				return;
			}

			frame = 0;

			const { animation } = keys[code];
			if (animation == null) {
				return;
			}

			cancelAnimationFrame(animation);
			keys[code].animation = null;
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp, { passive: true });
		window.addEventListener('pointerdown', clearAnimations, { passive: true });
		window.addEventListener('blur', clearAnimations, { passive: true });
		return (): void => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('pointerdown', clearAnimations);
			window.removeEventListener('blur', clearAnimations);
			clearAnimations();
		};
	}, [framerate, keyBinds, steps]);
}
