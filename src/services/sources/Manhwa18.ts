import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

/* eslint-disable class-methods-use-this */
export default class Manhwa18 extends Source {
	readonly baseUrl: string = 'https://manhwa18.cc';

	readonly icon: string = `${this.baseUrl}/images/favicon-160x160.png`;

	readonly tags: string[] = ['Manhwa'];

	readonly title: string = 'Manhwa18';

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
			'.read-content > img'
		);

		return Array.from(elements)
			.map((element: HTMLImageElement): string => element.src)
			.map((link: string): string =>
				Source.proxy(`${link}?referrer=${this.baseUrl}`)
			)
			.filter((link: string) => link.length > 0);
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const document: Document = await Source.fetch(url, 'HTML');

		const altTitleElement = document.querySelectorAll(
			'div.tab-summary .summary-heading'
		)[1];

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
			document.querySelector('.panel-story-description p')?.textContent ??
			'N/A';

		const genre: string[] = Array.from(
			document.querySelectorAll('div.tab-summary .genres-content a')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document.querySelector<HTMLImageElement>('.summary_image img')?.src ?? '';

		const rating = Number(
			document.querySelector('div.tab-summary span.avgrate')?.textContent
		);

		const status: ItemContents['status'] = this.getStatus(
			document
				.querySelector('.post-status')
				?.children[1].querySelector('.summary-content')?.textContent
		);

		const title: string =
			document.querySelector('.post-title span')?.nextSibling?.textContent ??
			'N/A';

		const year: string =
			document
				.querySelector('.post-status')
				?.children[0].querySelector('.summary-content')?.textContent ?? 'N/A';

		const chaptersElems: HTMLAnchorElement[] = Array.from(
			document.querySelectorAll('.row-content-chapter > li > a')
		);
		const chapters: Chapter[] = chaptersElems.map(
			(chapterLink: HTMLAnchorElement): Chapter => {
				const date: string = chapterLink.nextElementSibling?.textContent ?? '';

				const label: string = chapterLink.textContent ?? '';

				const href: string = chapterLink.getAttribute('href') ?? '';

				return {
					date,
					label,
					link: `${this.baseUrl}${href}`,
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
			year,
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		return url.replace(/\/chapter-.*/, '');
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const document: Document = await Source.fetch(
			`${this.baseUrl}/search?q=${searchQuery.split(' ').join('+')}`,
			'HTML'
		);

		const elements: HTMLDivElement[] = Array.from(
			document.querySelectorAll('.manga-item')
		);

		return elements.map((element: HTMLDivElement): SearchResult => {
			const link: HTMLAnchorElement | null = element.querySelector('a');

			const href: string | null | undefined = link?.getAttribute('href');

			const image: string = link?.querySelector('img')?.src ?? '';

			return {
				image,
				title: link?.title ?? '',
				url: href != null ? `${this.baseUrl}${href}` : '',
			};
		});
	}
}
