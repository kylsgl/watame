import { atomWithStorage } from 'jotai/utils';
import { type UniqueIdentifier } from '@dnd-kit/core';

import { type SourcesEntry, sourcesInstances } from '../services/sources';

export interface SourcesStateAtomEntry extends Omit<SourcesEntry, 'source'> {
	id: UniqueIdentifier;
}

export type SourcesStateAtom = Record<string, SourcesStateAtomEntry>;

export const sourcesStateAtom = atomWithStorage<SourcesStateAtom>(
	'sources-opts',
	Object.fromEntries(
		Object.entries(sourcesInstances)
			.filter(
				(source): source is [string, SourcesEntry] => source[1] !== undefined
			)
			.sort(([, a], [, b]) => a.source.title.localeCompare(b.source.title))
			.map(([key, val]): [string, SourcesStateAtomEntry] => [
				key,
				{
					enabled: val.enabled,
					id: key,
				},
			])
	)
);
