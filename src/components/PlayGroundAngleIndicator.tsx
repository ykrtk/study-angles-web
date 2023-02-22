import styles from '@/styles/PlayGroundAngleIndicator.module.scss'
import { useTranslations } from 'next-intl'
import { useContext, useEffect } from 'react';
import { AngleContext } from './providers/AngleProvider';

export function PlayGroundAngleIndicator() {
  const t = useTranslations('PlayGroundAngleIndicator');
  const { angle, setAngle } = useContext(AngleContext);

  useEffect(() => {
    // Set initial value (=0) when this component mounts
    setAngle(0);
  }, [setAngle]);

  return (
    <div className={styles.angleindicator}>
      <h2 className={styles.indicatortext}>{t.rich('currentAngleDegree', {
          degree: angle,
          important: (chunks) => <span className={styles.degree}>{chunks}</span>
      })}</h2>
    </div>
  );
}