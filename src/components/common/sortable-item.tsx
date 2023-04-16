import React, {
	type CSSProperties,
	type PropsWithChildren,
	createContext,
	useContext,
	useMemo,
} from 'react';
import {
	type DraggableAttributes,
	type DraggableSyntheticListeners,
	type UniqueIdentifier,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from '@tabler/icons-react';

import styles from './sortable-item.module.scss';

interface Props {
	id: UniqueIdentifier;
}

interface Context {
	attributes: DraggableAttributes;
	listeners: DraggableSyntheticListeners;
	ref: (node: HTMLElement | null) => void;
}

const SortableItemContext = createContext<Context>({
	attributes: {
		role: '',
		tabIndex: 0,
		'aria-disabled': false,
		'aria-pressed': undefined,
		'aria-roledescription': '',
		'aria-describedby': '',
	},
	listeners: undefined,
	ref() {},
});

export function SortableItem({
	children,
	id,
}: PropsWithChildren<Props>): JSX.Element {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
	} = useSortable({ id });

	const context = useMemo(
		() => ({
			attributes,
			listeners,
			ref: setActivatorNodeRef,
		}),
		[attributes, listeners, setActivatorNodeRef]
	);

	const style: CSSProperties = {
		opacity: isDragging ? 0.4 : undefined,
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<SortableItemContext.Provider value={context}>
			<div ref={setNodeRef} style={style}>
				{children}
			</div>
		</SortableItemContext.Provider>
	);
}

export function DragHandle(): JSX.Element {
	const { attributes, listeners, ref } = useContext(SortableItemContext);

	return (
		<div
			{...attributes}
			{...listeners}
			className={styles['drag-handle']}
			ref={ref}
		>
			<IconGripVertical size={18} stroke={2} />
		</div>
	);
}
