import styles from '@/styles/PlayGroundDescription.module.scss'
import { useTranslations } from 'next-intl'

export function PlayGroundDescription() {
  const t = useTranslations('PlayGroundDescription');

  return (
    <div>
        <h2 className={styles.title}>{t('playGroundSectionTitle')}</h2>
        <ul className={styles.instruction}>
            <li>{t('instructionItem1')}</li>
            <li>{t('instructionItem2')}</li>
            <li>{t('instructionItem3')}</li>
        </ul>
    </div>
  );
}