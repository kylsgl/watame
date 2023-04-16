import type { Chapter, ItemContents } from '../../components/item';
import type { SearchResult } from '../../components/search/interfaces';

import Source from './Source';

interface MangaLifeDirectoryItem {
	/** Alternative titles */
	a: string[];
	/** Title id */
	i: string;
	/** Title */
	s: string;
}

interface MangaLifeChapter {
	Chapter: string;
	Type: string;
	Date: string;
	ChapterName: string | null;
	Page?: string;
	Directory?: string;
}

/* eslint-disable class-methods-use-this */
export default class MangaSee extends Source {
	readonly baseUrl: string = 'https://mangasee123.com';

	readonly icon: string = `${this.baseUrl}/media/favicon.png`;

	readonly tags: string[] = ['Manga', 'Manhwa'];

	readonly title: string = 'MangaSee';

	buildChapterUrl(id: string, chapter: string): string {
		const specialNumber = Number(chapter.slice(-1));
		const chapterNumber = Number(
			`${chapter.slice(1, -1)}${specialNumber > 0 ? `.${specialNumber}` : ''}`
		);
		const indexNumber = Number(chapter.slice(0, 1));

		const indexUrl: string = indexNumber !== 1 ? `-index-${indexNumber}` : '';

		return `${this.baseUrl}/read-online/${id}-chapter-${chapterNumber}${indexUrl}.html`;
	}

	getChapterNumber(chapter: string): string {
		const specialNumber = Number(chapter.slice(-1));
		return `${chapter.slice(1, -1)}${
			specialNumber > 0 ? `.${specialNumber}` : ''
		}`;
	}

	async getChapterPages(url: string): Promise<string[]> {
		const document: Document = await Source.fetch(url, 'HTML');

		const id: string =
			document
				.querySelector("meta[property='og:url']")
				?.getAttribute('content')
				?.match(/.*\/(.*)-chapter-.*/)?.[1] ?? 'Not Found';

		const chapterElem: string | null | undefined = Array.from(
			document.querySelectorAll<HTMLScriptElement>('script')
		).find(
			(el: HTMLScriptElement): boolean =>
				el.textContent?.includes('vm.CurChapter') ?? false
		)?.textContent;

		if (chapterElem == null) {
			throw new Error('Invalid Chapter');
		}

		const pathName: string | undefined = chapterElem.match(
			/vm\.CurPathName = "(.*)";/
		)?.[1];

		if (pathName == null) {
			return [];
		}

		const imagesObj: string | undefined = chapterElem.match(
			/vm\.CurChapter = (.*);/
		)?.[1];

		const parsedImages = (
			imagesObj != null ? JSON.parse(imagesObj) : {}
		) as MangaLifeChapter;

		const chapterNumber = this.getChapterNumber(parsedImages.Chapter);

		const directory =
			parsedImages.Directory != null && parsedImages.Directory.length > 0
				? `/${parsedImages.Directory}`
				: '';

		return Array(Number(parsedImages.Page ?? 0))
			.fill(undefined)
			.map((_, idx): string => {
				const pageNumber: string = (idx + 1).toString().padStart(3, '0');

				return `https://${pathName}/manga/${id}${directory}/${chapterNumber}-${pageNumber}.png`;
			});
	}

	async getItemContents(url: string): Promise<ItemContents> {
		const document: Document = await Source.fetch(url, 'HTML');

		const scriptElems: HTMLScriptElement[] = Array.from(
			document.querySelectorAll<HTMLScriptElement>('script')
		);

		const id: string =
			document
				.querySelector("meta[property='og:url']")
				?.getAttribute('content')
				?.replace(`${this.baseUrl}/manga/`, '') ?? 'Not Found';

		const altTitle: string =
			scriptElems
				.find(
					(el: HTMLScriptElement): boolean =>
						el.textContent?.includes('alternateName') ?? false
				)
				?.textContent?.match(/"alternateName": \["(.*?)"/)?.[1] ?? 'N/A';

		const author: string[] = Array.from(
			document.querySelectorAll('a[href^="/search/?author="]')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const description: string =
			document.querySelector('li > div.top-5.Content')?.textContent ?? 'N/A';

		const genre: string[] = Array.from(
			document.querySelectorAll('a[href^="/search/?genre="]')
		)
			.map((el) => el.textContent)
			.filter((str): str is string => str != null);

		const image: string =
			document
				.querySelector("meta[property='og:image']")
				?.getAttribute('content') ?? 'N/A';

		const status = (document
			.querySelector('a[href^="/search/?status="]')
			?.textContent?.split(' ')[0] ?? 'N/A') as ItemContents['status'];

		const title: string =
			document
				.querySelector("meta[property='og:title']")
				?.getAttribute('content')
				?.split(' |')[0] ?? 'N/A';

		const year: string =
			document.querySelector('a[href^="/search/?year="]')?.textContent ?? 'N/A';

		const chaptersObj: string | undefined = scriptElems
			.find(
				(el: HTMLScriptElement): boolean =>
					el.textContent?.includes('vm.Chapters') ?? false
			)
			?.textContent?.match(/vm\.Chapters = (.*);/)?.[1];

		const parsedChapters = (
			chaptersObj != null ? JSON.parse(chaptersObj) : []
		) as MangaLifeChapter[];

		const chapters: Chapter[] = parsedChapters.map(
			({
				Chapter: chapter,
				Date: date,
				Type: type,
			}: MangaLifeChapter): Chapter => {
				const chapterNumber = Number(this.getChapterNumber(chapter));

				return {
					date,
					group: type,
					label: `${type} ${chapterNumber}`,
					link: this.buildChapterUrl(id, chapter),
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
			year,
		};
	}

	getItemUrlFromChapterUrl(url: string): string {
		return url.replace('/read-online', '/manga').replace(/-chapter-.*/, '');
	}

	async searchByTitle(searchQuery: string): Promise<SearchResult[]> {
		const directory: MangaLifeDirectoryItem[] = await Source.fetch<
			MangaLifeDirectoryItem[]
		>(Source.proxy(`${this.baseUrl}/_search.php`), 'JSON');

		const searchResults: MangaLifeDirectoryItem[] = directory.filter(
			({ a, s }: MangaLifeDirectoryItem) =>
				s.toLowerCase().includes(searchQuery) ||
				a.some((altTitle) => altTitle.toLowerCase().includes(searchQuery))
		);

		return searchResults.map(
			({ i, s: title }: MangaLifeDirectoryItem): SearchResult => ({
				image: `https://temp.compsci88.com/cover/${i}.jpg`,
				title,
				url: `${this.baseUrl}/manga/${i}`,
			})
		);
	}
}
