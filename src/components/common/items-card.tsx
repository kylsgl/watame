import { Card, Skeleton } from '@mantine/core';

import styles from './items-card.module.scss';

interface ItemsCardProps {
	children: JSX.Element | JSX.Element[] | null;
	className?: string;
	isLoading?: boolean;
	skeleton?: boolean;
	skeletonClassName?: string;
}

export default function ItemsCard({
	children,
	className = '',
	isLoading = false,
	skeleton = true,
	skeletonClassName = '',
}: ItemsCardProps): JSX.Element {
	const jsxCard: JSX.Element = (
		<Card
			className={`
				${styles.card}
				${!skeleton ? styles.shadow : ''}
				${className}
			`}
		>
			{children}
		</Card>
	);

	return skeleton ? (
		<Skeleton
			className={`${styles.skeleton} ${styles.shadow} ${skeletonClassName}`}
			visible={isLoading}
		>
			{jsxCard}
		</Skeleton>
	) : (
		jsxCard
	);
}
