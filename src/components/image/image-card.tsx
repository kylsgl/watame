import { type KeyboardEvent } from 'react';

interface ImageCardProps {
	className?: string;
	id?: string;
	children: JSX.Element;
	ref?: (element: unknown) => void;
	onClick?: () => void;
	title?: string;
}

export default function ImageCard({
	className,
	id,
	children,
	ref,
	title,
	onClick,
}: ImageCardProps): JSX.Element {
	const handleKeyDown = ({ key }: KeyboardEvent<HTMLImageElement>): void => {
		if (key === 'Enter' && onClick !== undefined) {
			onClick();
		}
	};

	return (
		<div
			className={className}
			id={id}
			ref={ref}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role="button"
			style={{
				cursor: onClick != null ? 'pointer' : undefined,
			}}
			tabIndex={onClick != null ? 0 : undefined}
		>
			{title !== undefined ? (
				<section>
					<span>{title}</span>
				</section>
			) : null}

			{children}
		</div>
	);
}
