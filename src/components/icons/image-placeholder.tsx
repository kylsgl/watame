interface ImagePlaceholderProps {
	className?: string;
	fill?: string;
}

export default function ImagePlaceholder({
	className,
	fill,
}: ImagePlaceholderProps): JSX.Element {
	return (
		<svg
			className={className}
			fill={fill}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 700 467"
		>
			<path
				d="M676 0H24A24 24 0 0 0 0 24v419a24 24 0 0 0 24 24h652a24 24 0 0 0 24-24V24a24 24 0 0 0-24-24Zm-5 414a24 24 0 0 1-24 24H53a24 24 0 0 1-24-24V54a24 24 0 0 1 24-24h594a24 24 0 0 1 24 24Z"
				className="cls-1"
			/>
			<path
				d="M58 397.4a7.8 7.8 0 0 0 13.3 5.5L190 283.2a23.3 23.3 0 0 1 32-1l36.1 31.7a23.3 23.3 0 0 0 31.1-.3l112.2-102.5a23.3 23.3 0 0 1 32.1.6l194.2 191.5a7.8 7.8 0 0 0 13.2-5.5V59H58ZM554.2 95.1a51 51 0 1 1-51 51 51 51 0 0 1 51-51Z"
				className="cls-1"
			/>
		</svg>
	);
}
