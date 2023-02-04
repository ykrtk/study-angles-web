import styles from '@/styles/Navigation.module.scss';
import { Inter } from '@next/font/google';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export function Navigation() {
    const t = useTranslations('Navigation');
    const { locale, locales, route } = useRouter();
    const otherLocale = locales?.find((current) => current !== locale);

    return (
        <div>
            <div className={styles.switchlocale}>
                <Link href={route} locale={otherLocale}>
                    {t('switchLocale', {locale: otherLocale})}
                </Link>
            </div>
        </div>
    );
}