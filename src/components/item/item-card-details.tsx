import { Fragment } from 'react';
import { useItemContentsQuery } from '@/hooks';

import ItemCard from './item-card';

interface ItemCardDetailsProps {
	className?: string;
	children?: JSX.Element | JSX.Element[];
	onClick: (url: string) => void;
	url: string;
}

export default function ItemCardDetails({
	className,
	children,
	onClick,
	url,
}: ItemCardDetailsProps): JSX.Element {
	const { fetchStatus, isError, isLoading, isSuccess, data } =
		useItemContentsQuery(true, url);

	const isReady =
		!(fetchStatus !== 'idle' || isError || isLoading) && isSuccess;

	return (
		<Fragment>
			<div className={className}>
				{isReady && data !== undefined ? (
					<ItemCard
						imageUrl={data.image}
						itemUrl={url}
						lazy={false}
						onClick={onClick}
						title={data.title}
					>
						{children}
					</ItemCard>
				) : null}
			</div>
		</Fragment>
	);
}
