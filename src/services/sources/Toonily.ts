import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

import { replaceImageSizesFromUrl } from '../../lib/utils';

/* eslint-disable class-methods-use-this */
export default class Toonily extends Source {
	readonly baseUrl: string = 'https://toonily.com';

	readonly icon: string = `${this.baseUrl}/wp-content/uploads/2020/01/cropped-toonfavicon-1-192x192.png`;

	readonly regexChapterUrl: RegExp = /(\/chapter-)(\d+)/gi;

	readonly tags: string[] = ['Manhwa'];

	readonly title: string = 'Toonily';

	private getStatus(str: string | null | undefined): ItemContents['status'] {
		if (str == null) {
			return 'N/A';
		}

		const strLowerCase: string = str.toLowerCase();

		if (strLowerCase.includes('complete')) {
			return 'Complete';
		}

		if (strLowerCase.includes('going')) {
			return 'Ongoing';
		}

		if (strLowerCase.includes('hiatus')) {
			return 'Hiatus';
		}

		return 'N/A';
	}

	async getChapterPages(url: string): Promise<string[]> {
		const document: Document = await Source.fetch(url, 'HTML');

		const elements: NodeListOf<HTMLImageElement> = document.querySelectorAll(
			'div > img.wp-manga-chapter-img'
		);

		if (elements.length <= 0) {
			throw new Error('Invalid Chapter');
		}

		return Array.from(elements)
			.map(
				(element: HTMLImageElement): string =>
					element.getAttribute('data-src') ?? ''
			)
			.filter((link: string) => link.length > 0)
			.map((link: string): string => {
				const target = 'https://cdn.toonily.com/chapters/';
				return `${target}${link.split(target)[1].replaceAll(/\s/g, '')}`;
			})
			.map((link: string): string => Source.proxy(link));
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const document: Document = await Source.fetch(url, 'HTML');

		const altTitleElement = document.querySelectorAll(
			'div.tab-summary .summary-heading'
		)[2];

		const altTitle: string =
			altTitleElement.textContent?.includes('Alt') === true
				? altTitleElement.nextElementSibling?.textContent?.replaceAll(
						/(\t|\n)/gi,
						''
				  ) ?? 'N/A'
				: 'N/A';

		const author: string[] = Array.from(
			document.querySelectorAll('div.tab-summary .author-content a')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const description: string =
			document.querySelector('.description-summary .summary__content')
				?.textContent ?? 'N/A';

		const genre: string[] = Array.from(
			document.querySelectorAll('div.tab-summary .genres-content a')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document
				.querySelector('div.tab-summary .summary_image img')
				?.getAttribute('data-src') ?? '';

		const rating = Number(
			document.querySelector('div.tab-summary span.score')?.textContent
		);

		const status: ItemContents['status'] = this.getStatus(
			document
				.querySelector('.post-status')
				?.children[1].querySelector('.summary-content')?.textContent
		);

		const title: string =
			document
				.querySelector('div.tab-summary .post-title h1')
				?.firstChild?.textContent?.trim() ?? 'N/A';

		const chaptersElems: HTMLAnchorElement[] = Array.from(
			document.querySelectorAll('ul > li.wp-manga-chapter > a')
		);

		const chapters: Chapter[] = chaptersElems.map(
			(chapter: HTMLAnchorElement): Chapter => ({
				date: chapter.nextElementSibling?.textContent ?? '',
				label: chapter.textContent ?? '',
				link: chapter.href,
			})
		);

		return {
			altTitle,
			author,
			chapters,
			description,
			genre,
			image: replaceImageSizesFromUrl(image),
			rating,
			status,
			title,
			year: 'N/A',
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		return url.replace(new RegExp(`${this.regexChapterUrl.source}.*`), '/');
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const document: Document = await Source.fetch(
			`${this.baseUrl}/search/${searchQuery
				.split(' ')
				.join('-')}?cookie=toonily-mature=1`,
			'HTML'
		);

		const elements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
			'.page-content-listing .item-thumb a'
		);

		return Array.from(elements).map((link: HTMLAnchorElement): SearchResult => {
			const image: string =
				link.querySelector('img')?.getAttribute('data-src') ?? '';

			return {
				image: replaceImageSizesFromUrl(image),
				title: link.title,
				url: link.href,
			};
		});
	}
}
