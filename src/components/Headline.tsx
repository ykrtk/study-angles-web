import styles from '@/styles/Headline.module.scss'
import { Inter } from '@next/font/google'
import { useTranslations } from 'next-intl'
import { Navigation } from './Navigation'

const inter = Inter({ subsets: ['latin'] })

export function Headline() {
  const t = useTranslations('Headline');

  return (
    <>
      <Navigation />
      <div className={styles.center}>
          <h1 className={styles.title}>{t('headlineTitle')}</h1>
      </div>
    </>
  );
}