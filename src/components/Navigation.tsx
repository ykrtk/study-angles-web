import styles from '@/styles/Navigation.module.scss';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Navigation() {
    const t = useTranslations('Navigation');
    const { locale, locales, route } = useRouter();
    const otherLocale = locales?.find((current) => current !== locale);

    return (
        <nav>
            <div className={styles.switchlocale}>
                <Link href={route} locale={otherLocale}>
                    {t('switchLocale', {locale: otherLocale})}
                </Link>
            </div>
        </nav>
    );
}