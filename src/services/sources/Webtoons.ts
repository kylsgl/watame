import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

import { replaceImageSizesFromUrl } from '../../lib/utils';

/* eslint-disable class-methods-use-this */
export default class Webtoons extends Source {
	readonly baseUrl: string = 'https://www.webtoons.com';

	readonly baseMobileUrl: string = 'https://m.webtoons.com';

	readonly icon: string =
		'https://webtoons-static.pstatic.net/image/favicon/ios_152x152.png';

	readonly regexChapterUrl: RegExp = /(\/chapter-)(\d+)/gi;

	readonly tags: string[] = ['Manhwa'];

	readonly title: string = 'Webtoons';

	private getStatus(str: string | null | undefined): ItemContents['status'] {
		switch (str?.toLowerCase()) {
			case 'update': {
				return 'Ongoing';
			}
			case 'end': {
				return 'Complete';
			}
			default: {
				return 'N/A';
			}
		}
	}

	async getChapterPages(url: string): Promise<string[]> {
		const document: Document = await Source.fetch(
			url.replace(this.baseMobileUrl, this.baseUrl),
			'HTML'
		);

		const elements: HTMLImageElement[] = Array.from(
			document.querySelectorAll('.viewer_lst .viewer_img img')
		);

		return elements
			.map(
				(element: HTMLImageElement): string =>
					element.getAttribute('data-url') ?? ''
			)
			.filter((link: string) => link.length > 0)
			.map((link: string): string => Source.proxy(link));
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const document: Document = await Source.fetch(url, 'HTML');

		const author: string[] =
			document
				.querySelector('p.author')
				?.textContent?.replaceAll(/(\t|\n)/g, '')
				.split(',') ?? [];

		const description: string =
			document.querySelector('.summary span')?.textContent ?? 'N/A';

		const genre: string[] = Array.from(document.querySelectorAll('p.genre'))
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document
				.querySelector('header')
				?.style.backgroundImage.match(/url\("(.*)"\)/)?.[1] ?? '';

		const rating =
			Number(document.querySelector('.grade_num')?.textContent) / 2;

		const status: ItemContents['status'] = this.getStatus(
			document.querySelector('.info_update span')?.textContent ?? 'N/A'
		);

		const title: string = document.title.split(' |')[0] ?? 'N/A';

		const chaptersElems: HTMLAnchorElement[] = Array.from(
			document.querySelectorAll('#_episodeList ._episodeItem a')
		);
		const chapters: Chapter[] = chaptersElems.map(
			(chapter: HTMLAnchorElement): Chapter => ({
				date: chapter.querySelector('.sub_info .date')?.textContent ?? '',
				label: chapter.querySelector('.sub_title .ellipsis')?.textContent ?? '',
				link: chapter.href,
			})
		);

		return {
			altTitle: 'N/A',
			author,
			chapters,
			description,
			genre,
			image: Source.proxy(replaceImageSizesFromUrl(image)),
			rating,
			status,
			title,
			year: 'N/A',
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		const cleanUrl: string = url.replace(/[.*/](ep.*)/, '');

		const titleNo: string = url.match(/(title_no=.*)&/)?.[0] ?? '';

		return `${cleanUrl}/list?${titleNo}redirect=true`.replace(
			this.baseUrl,
			this.baseMobileUrl
		);
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const document: Document = await Source.fetch(
			`${this.baseUrl}/en/search?keyword=${searchQuery
				.split(' ')
				.join('%20')}&redirect=true`,
			'HTML'
		);

		const elements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
			'._searchResult .card_lst a'
		);

		return Array.from(elements).map((link: HTMLAnchorElement): SearchResult => {
			const image: string = link.querySelector('img')?.src ?? '';

			const title: string =
				link.querySelector('.info .subj')?.textContent ?? 'Unknown';

			const url: string = link.getAttribute('href') ?? '';

			return {
				image: Source.proxy(image),
				title,
				url: `${this.baseMobileUrl}${url}&redirect=true`,
			};
		});
	}
}
