import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { type NextFont } from 'next/dist/compiled/@next/font';
import {
	type MantineThemeBase,
	ColorSchemeProvider,
	MantineProvider,
} from '@mantine/core';

import { type GlobalOpts, globalOptsAtom } from '@/store';

interface ThemeProps {
	children: JSX.Element | JSX.Element[];
	font?: NextFont;
}

export default function Theme({ children, font }: ThemeProps): JSX.Element {
	const [{ colorScheme }, setGlobalOpts] = useAtom(globalOptsAtom);

	const handleToggleColorScheme = (): void => {
		setGlobalOpts(
			(current): GlobalOpts => ({
				...current,
				colorScheme: current.colorScheme === 'light' ? 'dark' : 'light',
			})
		);
	};

	const focusRingStyle = (
		theme: MantineThemeBase
	): {
		outline: string;
		radius: string;
	} => ({
		outline: `2px solid ${
			colorScheme === 'dark' ? theme.colors.pink[2] : theme.colors.pink[6]
		}`,
		radius: '8px',
	});

	useEffect((): void => {
		// if (colorScheme === 'dark') {
		// 	document.body.classList.add(colorScheme);
		// } else {
		// 	document.body.classList.remove('dark');
		// }

		document.body.classList[colorScheme === 'dark' ? 'add' : 'remove']('dark');
	}, [colorScheme]);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={handleToggleColorScheme}
		>
			<MantineProvider
				withCSSVariables
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme,
					// primaryColor: 'green',
					defaultRadius: 'md',
					focusRing: 'auto',
					fontFamily: font?.style.fontFamily,
					primaryColor: 'pink',
					// loader: 'dots',
					primaryShade: {
						light: 6,
						dark: 2,
					},
					// white: '#f1f1f1'
					// border color: #dbdbdb
					focusRingStyles: {
						inputStyles: focusRingStyle,
						styles: focusRingStyle,
					},
				}}
			>
				{children}
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
