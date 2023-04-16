export interface Chapter {
	date: string;
	group?: string;
	label: string;
	link: string;
	timeSince?: string;
}

export interface ItemContents {
	altTitle: string | 'N/A';
	author: string[];
	chapters: Chapter[];
	description: string | 'N/A';
	genre: string[];
	image: string | 'N/A';
	rating: number;
	status: 'Complete' | 'Ongoing' | 'Hiatus' | 'N/A';
	title: string | 'N/A';
	year: string | 'N/A';
}
