import styles from './settings-item.module.scss';

interface SettingsItemProps {
	children: JSX.Element | JSX.Element[];
	className?: string;
	group?: boolean;
	subtitle?: string;
	text?: string;
	title: string;
}
export default function SettingsItem({
	children,
	className = '',
	group = false,
	subtitle,
	text,
	title,
}: SettingsItemProps): JSX.Element {
	return (
		<div
			className={`
				${styles.container}
				${group ? styles.group : ''}
				${className}
			`}
		>
			<div className={styles.details}>
				<span>{title}</span>
				<span className={styles.subtitle}>
					{subtitle !== undefined ? <span>{subtitle}</span> : null}
					{text !== undefined ? (
						<span className={styles.italic}>{text}</span>
					) : null}
				</span>
			</div>
			{children}
		</div>
	);
}
