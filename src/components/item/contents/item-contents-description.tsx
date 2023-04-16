import {
	type FC,
	type MouseEvent,
	Fragment,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Spoiler, Text } from '@mantine/core';
import {
	type TablerIconsProps,
	IconChevronDown,
	IconChevronUp,
} from '@tabler/icons-react';

import styles from './item-contents-description.module.scss';

function Label(label: string, Icon: FC<TablerIconsProps>): JSX.Element {
	return (
		<Fragment>
			{label} <Icon size="0.8rem" stroke={1.5} />
		</Fragment>
	);
}

interface ItemContentsDescriptionProps {
	className?: string;
	children: JSX.Element | JSX.Element[] | string | null;
	isOpen?: boolean;
	maxHeight: number;
	minHeight: number;
}

export default function ItemContentsDescription({
	className = '',
	children,
	isOpen = false,
	maxHeight,
	minHeight,
}: ItemContentsDescriptionProps): JSX.Element {
	const [isSpoilerOpen, setIsOpen] = useState<boolean>(isOpen);

	const spoilerRef = useRef<HTMLDivElement>(null);
	const spoilerTextRef = useRef<HTMLDivElement>(null);

	useEffect((): void => {
		if (spoilerRef.current == null || spoilerTextRef.current == null) {
			return;
		}

		const rect: DOMRect = spoilerTextRef.current.getClientRects()[0];

		if (rect.height <= maxHeight) {
			spoilerRef.current.style.minHeight = '1rem';

			setIsOpen(true);
		}
	}, [isSpoilerOpen, maxHeight]);

	const handeClick = (event: MouseEvent<HTMLDivElement> | undefined): void => {
		const target: EventTarget | undefined = event?.target;

		if (!(target instanceof HTMLButtonElement)) {
			return;
		}

		if (target.textContent?.includes('more') ?? false) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	};

	return (
		<Spoiler
			className={`
				${styles.spoiler}
				${!isSpoilerOpen ? styles.closed : ''}
				${className}
			`}
			hideLabel={Label('show less', IconChevronUp)}
			initialState={isSpoilerOpen}
			maxHeight={maxHeight}
			mih={minHeight}
			onClick={handeClick}
			ref={spoilerRef}
			showLabel={Label('show more', IconChevronDown)}
		>
			<div className={styles.container}>
				<div className={isSpoilerOpen ? styles.scroll : ''}>
					{/* <Text size="md" mx="xs" mb="md"> */}
					<Text ref={spoilerTextRef} size="md">
						{children}
					</Text>
				</div>
			</div>
		</Spoiler>
	);
}
