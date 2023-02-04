import styles from '@/styles/Headline.module.scss'
import { Inter } from '@next/font/google'
import { useTranslations } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

export function Headline() {
  const t = useTranslations('Headline');

  return (
    <>
        <div className={styles.center}>
            <h1 className={styles.title}>{t('headlineTitle')}</h1>
        </div>
    </>
  );
}