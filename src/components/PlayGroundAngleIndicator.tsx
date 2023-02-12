import styles from '@/styles/PlayGroundAngleIndicator.module.scss'
import { useTranslations } from 'next-intl'

export function PlayGroundAngleIndicator() {
  const t = useTranslations('PlayGroundAngleIndicator');
  const degrees = 90;

  return (
    <div className={styles.angleindicator}>
        <p className={styles.indicatortext}>{t.rich('currentAngleDegree', {
            degree: degrees,
            important: (chunks) => <span className={styles.degree}>{chunks}</span>
        })}</p>
    </div>
  );
}