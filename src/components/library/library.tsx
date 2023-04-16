import styles from './library.module.scss';

// import LibraryRecommendations from './library-recommendations';
import LibraryContents from './library-contents';

export default function Library(): JSX.Element {
	return (
		<div className={styles.container}>
			{/* <LibraryRecommendations /> */}
			<LibraryContents />
		</div>
	);
}
