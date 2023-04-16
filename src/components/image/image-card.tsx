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
	return (
		<div
			className={className}
			id={id}
			ref={ref}
			onClick={onClick}
			style={{
				cursor: onClick != null ? 'pointer' : undefined,
			}}
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
