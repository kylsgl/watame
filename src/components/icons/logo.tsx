import LogoImage from './logo-image';
import LogoText from './logo-text';

import styles from './logo.module.scss';

interface LogoProps {
	className?: string;
	fill?: string;
	width?: string;
}

export default function Logo({
	className = '',
	fill,
	width,
}: LogoProps): JSX.Element {
	return (
		<div className={`${styles.logo} ${className}`} style={{ width }}>
			<LogoImage className={styles.image} fill={fill} />
			<LogoText className={styles.text} fill={fill} />
		</div>
	);
}
