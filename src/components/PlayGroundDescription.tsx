import styles from '@/styles/PlayGroundDescription.module.scss';
import { useTranslations } from 'next-intl';

export function PlayGroundDescription() {
    const t = useTranslations('PlayGroundDescription');

    return (
        <div className={styles.pgdesccontainer}>
            <div className={styles.pgdescheadline}>
                <h2 className={styles.pgdescheading}>
                    {t('playGroundSectionTitle')}
                    <span className={styles.dummyforalign}> </span>
                </h2>
            </div>
            <div className={styles.pgdescmain}>
                <ul className={styles.instruction}>
                    <li>{t('instructionItem1')}</li>
                    <li>{t('instructionItem2')}</li>
                    <li>{t('instructionItem3')}</li>
                </ul>
            </div>
        </div>
    );
}
