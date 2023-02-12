import styles from '@/styles/Index.module.scss'
import { Inter } from '@next/font/google'
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import Image from 'next/image'
import { Footer } from '@/components/Footer'
import { Headline } from '@/components/Headline'
import { PlayGroundCanvas } from '@/components/PlayGroundCanvas'
import { PlayGroundAngleIndicator } from '@/components/PlayGroundAngleIndicator'

const inter = Inter({ subsets: ['latin'] })

export default function Index() {
  const t = useTranslations('Index');
  const fontFamily = t('fontFamily');

  return (
    <div className={styles.content}>
      <Head>
        <title>{t('htmlTitle')}</title>
        <meta name="description" content="Study angles web site" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Headline fontFamily={fontFamily} />
      <hr />
      <main className={styles.main} style={{"fontFamily" : fontFamily}}>
        <section className={styles.playgroundcontainer}>
          <div className={styles.playgroundcanvas}>
            <PlayGroundAngleIndicator />
            <PlayGroundCanvas />
          </div>
          <div className={styles.playgrounddesc}>
            <h2>{t('playGroundSectionTitle')}</h2>
          </div>
        </section>
      </main>
      <hr />
      <Footer />
    </div>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  // If you don't use internationalized routing, define this statically.
  const locale = context.locale;

  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language.
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  };
}