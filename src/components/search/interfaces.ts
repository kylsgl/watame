export interface SearchResult {
	url: string;
	image: string | null | undefined;
	title: string;
}

export type SourceSearchResults = [source: string, results: SearchResult[]];
