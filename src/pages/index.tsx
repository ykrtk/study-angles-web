import styles from '@/styles/Index.module.scss'

import { useEffect, useState } from 'react'
import { Inter } from '@next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl'

import { Footer } from '@/components/Footer'
import { Headline } from '@/components/Headline'
import { MainTabs } from '@/components/MainTabs'


const inter = Inter({ subsets: ['latin'] })

export default function Index() {
  const t = useTranslations('Index');
  const fontFamily = t('fontFamily');
  const [isTouchSupported, setIsTouchSupported] = useState(false);

  const renderFooter = (isTouchSupportDevice: boolean): JSX.Element | null => {
    if (isTouchSupportDevice) {
      // Do not render footer
      return null;
    } else {
      return (
        <div>
          <hr />
          <Footer />
        </div>
      );
    }
  }

  useEffect(() => {
    const hasTouchPoints = (navigator.maxTouchPoints > 0);
    setIsTouchSupported(hasTouchPoints);
  }, []);

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
        <MainTabs fontFamily={fontFamily} />
      </main>
      {/* {renderFooter(isTouchSupported)} */}
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