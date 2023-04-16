import type {
	MoveChapterEvent,
	MovePageEvent,
	MovePageShallowEvent,
} from '@/hooks/useChapterEvents';

export function getCurrentPageNumber(): number {
	const hash: string = window.location.hash.replace('#page=', '');
	const page = Number(hash);
	return hash.length > 0 && !Number.isNaN(page) ? page : 1;
}

export function getFileNameFromUrl(url: string): string | null {
	const fileExtensions: string[] = [
		'bmp',
		'gif',
		'html',
		'jpg',
		'jpeg',
		'png',
		'svg',
		'webp',
	];

	const matchFileExtensions = new RegExp(
		`[\\w-]+\\.(${fileExtensions.join('|')})`,
		'gi'
	);

	const fileName: string | undefined = url.match(matchFileExtensions)?.[0];

	return fileName ?? null;
}

// https://stackoverflow.com/a/3177838
export function getTimeSince(date: number): string {
	const seconds: number = Math.floor((Number(new Date()) - date) / 1000);

	let interval: number = seconds / 31536000;

	const format = (label: string): string => {
		const time: number = Math.floor(interval);
		return `${time} ${label}${time > 1 ? 's' : ''} ago`;
	};

	if (interval > 1) {
		return format('year');
	}

	interval = seconds / 2592000;
	if (interval > 1) {
		return format('month');
	}

	interval = seconds / 86400;
	if (interval > 1) {
		return format('day');
	}

	interval = seconds / 3600;
	if (interval > 1) {
		return format('hour');
	}

	interval = seconds / 60;
	if (interval > 1) {
		return format('minute');
	}

	return format('second');
}

export function moveChapter(
	chapter: MoveChapterEvent['chapter'],
	page?: MoveChapterEvent['page'],
	callback?: () => void
): void {
	window.dispatchEvent(
		new CustomEvent('chapter', {
			detail: {
				chapter,
				page,
			},
		})
	);

	if (callback !== undefined) {
		callback();
	}
}

export function movePage<T extends boolean = false>(
	page: T extends false ? MovePageEvent['page'] : MovePageShallowEvent['page'],
	shallow: T = false as T
): void {
	window.dispatchEvent(
		new CustomEvent(`chapter:page${shallow ? ':shallow' : ''}`, {
			detail: {
				page,
			},
		})
	);
}

export function replaceImageSizesFromUrl(
	url: string,
	width = 0,
	height = 0
): string {
	// selects '-224x320' from 'eleceed-224x320.jpg'
	const matchImageSize = /(?:[-_]?[0-9]+x[0-9]+)+/g;
	const size: string = height > 0 && width > 0 ? `-${width}x${height}` : '';
	return url.replace(matchImageSize, size);
}

export function parseJSON<T extends object>(
	json: string,
	verifyKeys: Array<keyof T>
): T | null {
	const isTypeT = (object: object): object is T =>
		verifyKeys.every((key): key is keyof T => key in object);

	try {
		const parsed: unknown = JSON.parse(json);

		if (parsed == null || typeof parsed !== 'object' || !isTypeT(parsed)) {
			throw new Error('Invalid JSON');
		}

		return parsed;
	} catch (error) {
		return null;
	}
}

export function updatePageHash(page: number): void {
	window.location.hash = `#page=${page}`;
}
