import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

/* eslint-disable class-methods-use-this */
export default class Hiperdex extends Source {
	readonly baseUrl: string = 'https://hiperdex.com';

	readonly icon: string = `${this.baseUrl}/wp-content/uploads/2023/02/cropped-favicon-192x192.png`;

	readonly tags: string[] = ['Manga', 'Manhwa'];

	readonly title: string = 'Hiperdex';

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
			'.reading-content div > img'
		);

		return Array.from(elements)
			.map(
				(element: HTMLImageElement): string => element.getAttribute('src') ?? ''
			)
			.map((link: string): string => link.replaceAll(/\s/g, ''))
			.filter((link: string) => link.length > 0);
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const [document, chaptersDocument] = await Promise.all(
			[url, `${url}ajax/chapters/?method=POST`].map(
				async (target: string): Promise<Document> =>
					Source.fetch(target, 'HTML')
			)
		);

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
			document.querySelector('.description-summary .summary__content p')
				?.textContent ?? 'N/A';

		const genre: string[] = Array.from(
			document.querySelectorAll('div.tab-summary .genres-content a')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document.querySelector<HTMLImageElement>('.summary_image img')?.src ?? '';

		const rating = Number(
			document.querySelector('span.score.total_votes')?.textContent
		);

		const status: ItemContents['status'] = this.getStatus(
			document
				.querySelector('.post-status')
				?.children[1].querySelector('.summary-content')
				?.textContent?.trim()
		);

		const title: string =
			document.querySelector('.post-title h1')?.textContent?.trim() ?? 'N/A';

		const year: string =
			document
				.querySelector('.post-status')
				?.children[0].querySelector('.summary-content')
				?.textContent?.trim() ?? 'N/A';

		const chaptersElems: HTMLAnchorElement[] = Array.from(
			chaptersDocument.querySelectorAll('ul > li > a')
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
			image,
			rating,
			status,
			title,
			year,
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		const regexChapterUrl1 = /(\/chapter-)(\d+).*/gi;
		const regexChapterUrl2 = /\/\d+\//gi;

		return url.replace(regexChapterUrl1, '/').replace(regexChapterUrl2, '/');
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const document: Document = await Source.fetch(
			`${this.baseUrl}/?s=${searchQuery
				.split(' ')
				.join('+')}&post_type=wp-manga`,
			'HTML'
		);

		const elements: HTMLDivElement[] = Array.from(
			document.querySelectorAll('.c-tabs-item > .c-tabs-item__content')
		);

		return elements.map((element: HTMLDivElement): SearchResult => {
			const link: HTMLAnchorElement | null = element.querySelector('a');

			const href: string | null | undefined = link?.getAttribute('href');

			const image: string = link?.querySelector('img')?.src ?? '';

			return {
				image,
				title: link?.title ?? '',
				url: href != null ? href : '',
			};
		});
	}
}
