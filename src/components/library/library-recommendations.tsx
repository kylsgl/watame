import { useAtomValue } from 'jotai';
import { Fragment, useMemo } from 'react';
import { ItemsCard } from '@/components/common';
import { type LibraryEntry, bookmarksAtom, historyAtom } from '@/store';
import { ItemCard } from '../item';

import styles from './library-recommendations.module.scss';

function ItemsCardWrapper(element: JSX.Element): JSX.Element {
	return (
		<Fragment>
			<div className={`${styles.header}`}>
				<h1 className={styles.title}>{`Library`}</h1>
				<h1 className={styles.subtitle}>{5}</h1>
			</div>
			<ItemsCard
				key={element.key}
				className={styles['items-card']}
				skeleton={false}
			>
				{element}
			</ItemsCard>
		</Fragment>
	);
}

function ItemCardWrapper(
	libraryEntry: LibraryEntry | undefined
): JSX.Element | null {
	if (libraryEntry === undefined) {
		return null;
	}

	const { author, imageUrl, itemUrl, title } = libraryEntry;

	return (
		<div key={itemUrl} className={styles.card}>
			<ItemCard
				details={false}
				imageUrl={imageUrl}
				lazy={false}
				loading="lazy"
				title={title}
			/>
			<div className={styles.details}>
				<span>{title}</span>
				<span className={styles.author}>{author.join(', ')}</span>
			</div>
		</div>
	);
}

export default function LibraryRecommendations(): JSX.Element {
	const history = useAtomValue(historyAtom) as Array<LibraryEntry | undefined>;

	const firstTenHistory = history.slice(0, 5);

	return (
		<div className={styles.container}>
			{/* {elemsToRender.map(ItemsCardWrapper)} */}
			<div>dsa</div>
			<div className={styles.history}>
				<h1>Continue Reading</h1>
				<div className={styles['history-container']}>
					{firstTenHistory
						.filter((entry): entry is LibraryEntry => entry !== undefined)
						.map(({ imageUrl, title }, index) => (
							<ItemCard
								className={styles.card}
								details
								imageUrl={imageUrl}
								key={imageUrl}
								lazy={false}
								loading="lazy"
								style={{
									// marginLeft: `-${15 * index}%`,
									marginLeft: '-90px',
									zIndex: firstTenHistory.length - index,
								}}
								title={title}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
