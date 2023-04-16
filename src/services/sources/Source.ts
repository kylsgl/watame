import type { ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

interface Proxies {
	servers: string[];
}

interface FetchMapTypes<T> {
	HTML: Document;
	IMG: string;
	JSON: T;
}

export default abstract class Source {
	abstract icon: string;

	abstract tags: string[];

	abstract title: string;

	abstract getChapterPages(url: string): Promise<string[]>;

	abstract getItemContents(url: string): Promise<ItemContents | null>;

	abstract getItemUrlFromChapterUrl(url: string): string;

	abstract searchByTitle(searchQuery: string): Promise<SearchResult[]>;

	static readonly PROXIES: Proxies = {
		servers: ['https://proxy-1.kylsgl.com/v2/'],
	};

	static async fetch<
		T,
		U extends keyof FetchMapTypes<T> = T extends unknown
			? 'JSON'
			: keyof FetchMapTypes<T>
	>(url: string, type: U, signal?: AbortSignal): Promise<FetchMapTypes<T>[U]> {
		if (url.length <= 0) {
			throw new Error(`Invalid url`);
		}

		if (type === 'IMG') {
			const imageElement: HTMLImageElement = new Image();
			imageElement.decoding = 'async';
			imageElement.referrerPolicy = 'no-referrer';
			imageElement.src = url;

			await imageElement.decode();

			return url as FetchMapTypes<T>[U];
		}

		const response = await fetch(Source.proxy(url), {
			method: 'GET',
			signal,
		});

		if (!response.ok) {
			throw new Error(`${response.status}, ${response.statusText}`);
		}

		if (type === 'HTML') {
			const text: string = await response.text();
			return new DOMParser().parseFromString(
				text,
				'text/html'
			) as FetchMapTypes<T>[U];
		}

		const json: unknown = await response.json();
		return json as FetchMapTypes<T>[U];
	}

	static proxy(url: string): string {
		const { servers } = Source.PROXIES;

		const matchServers = new RegExp(servers.join('|'), 'gi');

		const matchCloudflareMirage = /\/cdn.+?(?=https:)/g;

		const cleanUrl: string = url
			.replaceAll(matchServers, '')
			.replaceAll(matchCloudflareMirage, '');

		const proxy: string = servers[Math.floor(Math.random() * servers.length)];

		return `${proxy}${cleanUrl}`;
	}
}
