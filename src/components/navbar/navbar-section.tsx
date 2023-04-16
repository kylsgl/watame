import { Navbar } from '@mantine/core';

import styles from './navbar-section.module.scss';

interface NavbarSectionProps {
	borderTop?: boolean;
	borderBottom?: boolean;
	className?: string;
	children: JSX.Element | Array<JSX.Element | null>;
	grow?: boolean;
	scroll?: boolean;
}

export default function NavbarSection({
	borderBottom = false,
	borderTop = false,
	className = '',
	children,
	grow = false,
	scroll = false,
}: NavbarSectionProps): JSX.Element {
	return (
		<Navbar.Section
			className={`
				${borderBottom ? styles['border-bottom'] : ''}
				${borderTop ? styles['border-top'] : ''}
				${className} 
				${scroll ? styles.scroll : ''}`}
			grow={grow}
		>
			{children}
		</Navbar.Section>
	);
}
