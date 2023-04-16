import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

/* eslint-disable class-methods-use-this */
export default class MangaKatana extends Source {
	readonly baseUrl: string = 'https://mangakatana.com';

	readonly icon: string = `${this.baseUrl}/static/img/fav.png`;

	readonly tags: string[] = ['Manga', 'Manhwa'];

	readonly title: string = 'MangaKatana';

	async getChapterPages(url: string): Promise<string[]> {
		const document: Document = await Source.fetch(url, 'HTML');

		const chaptersEl: HTMLScriptElement | undefined = Array.from(
			document.querySelectorAll('script')
		).find(
			(el: HTMLScriptElement): boolean =>
				el.textContent?.includes('#imgs .wrap_img') ?? false
		);

		const imageUrlsArr: RegExpMatchArray[] = Array.from(
			chaptersEl?.textContent?.matchAll(/[^']*.jpg/g) ?? []
		);

		if (imageUrlsArr.length <= 0) {
			throw new Error('Invalid Chapter');
		}

		imageUrlsArr.shift();

		return imageUrlsArr.map(([link]: RegExpMatchArray): string => link);
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const document: Document = await Source.fetch(url, 'HTML');

		const altTitle: string =
			document.querySelector('.info .alt_name')?.textContent?.split(' ; ')[0] ??
			'N/A';

		const author: string[] =
			document.querySelector('.info .authors')?.textContent?.split(', ') ?? [];

		const description: string =
			document.querySelector('.summary p')?.textContent ?? 'N/A';

		const genre: string[] = Array.from(
			document.querySelectorAll('.info .genres a')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document.querySelector<HTMLImageElement>('.cover img')?.src ?? '';

		const status = (document.querySelector('.info .status')?.textContent ??
			'N/A') as ItemContents['status'];

		const title: string =
			document.querySelector('.info .heading')?.textContent ?? 'N/A';

		const chaptersElems: HTMLTableRowElement[] = Array.from(
			document.querySelectorAll('.chapters tbody tr')
		);

		const chapters: Chapter[] = chaptersElems.map(
			(chapter: HTMLTableRowElement): Chapter => {
				const date: string =
					chapter.querySelector('.update_time')?.textContent ?? 'N/A';

				const linkEl: HTMLAnchorElement | null =
					chapter.querySelector<HTMLAnchorElement>('.chapter a');

				const label: string = linkEl?.textContent ?? 'N/A';
				const link: string = linkEl?.href ?? 'N/A';

				return {
					date,
					label,
					link,
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
			rating: -1,
			status,
			title,
			year: 'N/A',
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		const urlArr = url.split('/');
		urlArr.pop();
		return urlArr.join('/');
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const document: Document = await Source.fetch(
			`${this.baseUrl}/?search=${searchQuery
				.split(' ')
				.join('+')}&search_by=book_name&redirect=true`,
			'HTML'
		);

		const elements: NodeListOf<HTMLDivElement> =
			document.querySelectorAll('#book_list > .item');

		return Array.from(elements).map((el: HTMLDivElement): SearchResult => {
			let image: string =
				el.querySelector<HTMLImageElement>('.wrap_img img')?.src ?? 'N/A';

			if (image !== 'N/A') {
				const splitImage = image.split('.');
				splitImage[1] = `${splitImage[1]}-l`;
				image = splitImage.join('.');
			}

			const linkEl = el.querySelector<HTMLAnchorElement>('h3.title a');

			const title = linkEl?.textContent ?? 'N/A';

			const url = linkEl?.href ?? 'N/A';

			return {
				image,
				title,
				url,
			};
		});
	}
}
