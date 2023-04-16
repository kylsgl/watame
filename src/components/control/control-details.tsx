import { Fragment } from 'react';
import { useAtomValue } from 'jotai';
import { Skeleton } from '@mantine/core';
import { IconAt, IconBook } from '@tabler/icons-react';

import { openedTitleAtom } from '@/store';

import NavbarItem from '../navbar/navbar-item';

export default function ControlDetails(): JSX.Element {
	const { itemTitle, source } = useAtomValue(openedTitleAtom);

	return (
		<Fragment>
			<Skeleton visible={itemTitle.length <= 0}>
				<NavbarItem icon={IconBook} isActive label={itemTitle} />
			</Skeleton>

			<Skeleton visible={source?.title == null}>
				<NavbarItem
					icon={IconAt}
					isActive
					label={source?.title ?? 'Not found'}
				/>
			</Skeleton>
		</Fragment>
	);
}
