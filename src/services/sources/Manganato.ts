import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

/* eslint-disable class-methods-use-this */
export default class Manganato extends Source {
	readonly baseUrl: string = 'https://manganato.com';

	readonly icon: string = `${this.baseUrl}/favicon-96x96.png`;

	readonly regexChapterUrl: RegExp = /(\/chapter-)(\d+)/gi;

	readonly tags: string[] = ['Manga', 'Manhwa'];

	readonly title: string = 'Manganato';

	async getChapterPages(url: string): Promise<string[]> {
		const document: Document = await Source.fetch(url, 'HTML');

		const elements: HTMLImageElement[] = Array.from(
			document.querySelectorAll('.container-chapter-reader > img')
		);

		return elements
			.map((element: HTMLImageElement): string => element.src)
			.filter((link: string) => link.length > 0)
			.map((link: string): string => Source.proxy(link));
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const document: Document = await Source.fetch(url, 'HTML');

		const altTitle: string =
			document
				.querySelector('.story-info-right .variations-tableInfo h2')
				?.textContent?.trim() ?? 'N/A';

		const author: string[] = Array.from(
			document.querySelectorAll('.story-info-right a[href*="/author/"]')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const description: string =
			document.querySelector('.panel-story-info-description')?.lastChild
				?.textContent ?? 'N/A';

		const genre: string[] = Array.from(
			document.querySelectorAll('.story-info-right a[href*="/genre-"]')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document.querySelector<HTMLImageElement>('.info-image > img')?.src ?? '';

		const rating = Number(
			document.querySelector('.story-info-right em[property="v:average"]')
				?.textContent
		);

		const status = (document.querySelector('.story-info-right .info-status')
			?.parentElement?.nextElementSibling?.textContent ??
			'N/A') as ItemContents['status'];

		const title: string =
			document.querySelector('.story-info-right > h1')?.textContent ?? 'N/A';

		const chaptersElems: HTMLLIElement[] = Array.from(
			document.querySelectorAll('.row-content-chapter li')
		);
		const chapters: Chapter[] = chaptersElems.map(
			(chapterElem: HTMLLIElement): Chapter => {
				const date: string =
					chapterElem.querySelector<HTMLSpanElement>('.chapter-time')?.title ??
					'';

				const linkElement: HTMLAnchorElement | null =
					chapterElem.querySelector('a');

				return {
					date,
					label: linkElement?.textContent ?? '',
					link: linkElement?.href ?? '',
				};
			}
		);

		return {
			altTitle,
			author,
			chapters,
			description,
			genre,
			image,
			rating,
			status,
			title,
			year: 'N/A',
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		return `${url.replace(/\/chapter-.*/, '')}?redirect=true`;
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const document: Document = await Source.fetch(
			`${this.baseUrl}/search/story/${searchQuery.split(' ').join('_')}`,
			'HTML'
		);

		const elements: NodeListOf<HTMLDivElement> =
			document.querySelectorAll('.search-story-item');

		return Array.from(elements).map((element: HTMLDivElement): SearchResult => {
			const linkElement: HTMLAnchorElement | null = element.querySelector('a');

			const url: string = linkElement?.href ?? '';

			const image: string = linkElement?.querySelector('img')?.src ?? '';

			const title: string = linkElement?.title ?? 'Unknown';

			return {
				image,
				title,
				url,
			};
		});
	}
}
