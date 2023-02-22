import styles from '@/styles/Headline.module.scss';
import { useTranslations } from 'next-intl';
import { Navigation } from './Navigation';

type HeadlineProps = {
    fontFamily: string;
};

export function Headline(props: HeadlineProps) {
    const t = useTranslations('Headline');

    return (
        <header>
            <Navigation />
            <hgroup
                className={styles.header}
                style={{ fontFamily: props.fontFamily }}
            >
                <h1 className={styles.title}>{t('headlineTitle')}</h1>
            </hgroup>
        </header>
    );
}
