import styles from '@/styles/Footer.module.css'
import { Inter } from '@next/font/google'
import { useTranslations } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

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