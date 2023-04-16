import { useAtom } from 'jotai';
import {
	type DragEndEvent,
	type UniqueIdentifier,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import {
	type SourcesStateAtom,
	type SourcesStateAtomEntry,
	sourcesStateAtom,
} from '@/store';
import { DragHandle, SortableItem } from '@/components/common';
import { type SourcesEntry, sourcesInstances } from '@/services/sources';

import styles from './settings-sources.module.scss';

import SettingSourcesItem from './settings-sources-item';

type SourceArray = [key: string, value: SourcesStateAtomEntry];

export default function SettingSources(): JSX.Element {
	const [sourcesState, setSourcesState] = useAtom(sourcesStateAtom);

	const sourcesStateArr: SourceArray[] = Object.entries(sourcesState);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = ({ active, over }: DragEndEvent): void => {
		if (over !== null && active.id !== over.id) {
			const activeIndex: number = sourcesStateArr.findIndex(
				([key]: SourceArray): boolean => key === active.id
			);

			const overIndex: number = sourcesStateArr.findIndex(
				([key]: SourceArray): boolean => key === over.id
			);

			setSourcesState(
				Object.fromEntries(arrayMove(sourcesStateArr, activeIndex, overIndex))
			);
		}
	};

	const handleCheck = (id: UniqueIdentifier, enabled: boolean): void => {
		if (!(id.toString() in sourcesInstances)) {
			return;
		}

		setSourcesState(
			(current): SourcesStateAtom => ({
				...current,
				[id]: {
					enabled,
					id,
				},
			})
		);
	};

	return (
		<div className={styles.container}>
			<DndContext onDragEnd={handleDragEnd} sensors={sensors}>
				<SortableContext items={Object.values(sourcesState)}>
					{sourcesStateArr.map(
						([key, { enabled }]: SourceArray): JSX.Element | null => {
							const item: SourcesEntry | undefined = sourcesInstances[key];

							if (item?.source === undefined) {
								return null;
							}

							const { icon, tags, title } = item.source;

							return (
								<SortableItem key={key} id={key}>
									<SettingSourcesItem
										dragHandle={<DragHandle />}
										enabled={enabled}
										icon={icon}
										id={key}
										onCheck={handleCheck}
										tags={tags.sort()}
										title={title}
									/>
								</SortableItem>
							);
						}
					)}
				</SortableContext>
			</DndContext>
		</div>
	);
}
