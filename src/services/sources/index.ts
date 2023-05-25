import MangaKatana from './MangaKatana';
import MangaLife from './MangaLife';
import Manganato from './Manganato';
import MangaSee from './MangaSee';
import Manhwa18 from './Manhwa18';
import Toonily from './Toonily';
import Webtoons from './Webtoons';
import { type SourcesEntry, type Sources } from './interfaces';
import Hiperdex from './Hiperdex';

export * from './interfaces';

export const sourcesInstances: Sources = new Proxy(
	{
		'hiperdex.com': {
			enabled: false,
			source: new Hiperdex(),
		},
		'mangakatana.com': {
			enabled: true,
			source: new MangaKatana(),
		},
		'manga4life.com': {
			enabled: true,
			source: new MangaLife(),
		},
		'manganato.com': {
			enabled: false,
			source: new Manganato(),
		},
		'mangasee123.com': {
			enabled: false,
			source: new MangaSee(),
		},
		'manhwa18.cc': {
			enabled: false,
			source: new Manhwa18(),
		},
		'toonily.com': {
			enabled: false,
			source: new Toonily(),
		},
		'webtoons.com': {
			enabled: false,
			source: new Webtoons(),
		},
	},
	{
		get(target, prop): SourcesEntry | undefined {
			const targetKeys: string[] = Object.keys(target);

			const matchHostname = new RegExp(targetKeys.join('|'), 'i');

			const key: string | undefined = prop.toString().match(matchHostname)?.[0];

			if (key == null) {
				return undefined;
			}

			return (target as Sources)[key];
		},
	}
);
