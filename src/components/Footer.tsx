import styles from '@/styles/Footer.module.scss';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Footer');

    return (
        <>
            <footer className={styles.footer}>
                <p>{t('providedBy')}</p>
            </footer>
        </>
    );
}
