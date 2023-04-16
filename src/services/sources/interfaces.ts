import type Source from './Source';

export interface SourcesEntry {
	enabled: boolean;
	source: Source;
}

export type Sources = Record<string, SourcesEntry | undefined>;
