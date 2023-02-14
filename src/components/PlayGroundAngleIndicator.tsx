import styles from '@/styles/PlayGroundAngleIndicator.module.scss'
import { useTranslations } from 'next-intl'
import { useContext } from 'react';
import { AngleContext } from './providers/AngleProvider';

export function PlayGroundAngleIndicator() {
  const t = useTranslations('PlayGroundAngleIndicator');
  const { angle } = useContext(AngleContext);

  return (
    <div className={styles.angleindicator}>
        <p className={styles.indicatortext}>{t.rich('currentAngleDegree', {
            degree: angle,
            important: (chunks) => <span className={styles.degree}>{chunks}</span>
        })}</p>
    </div>
  );
}