import styles from '@/styles/Index.module.scss'
import { Inter } from '@next/font/google'
import { GetStaticPropsContext } from 'next'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import Image from 'next/image'
import { Footer } from '@/components/Footer'
import { Headline } from '@/components/Headline'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Index() {
  const t = useTranslations('Index');
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <title>{t('htmlTitle')}</title>
        <meta name="description" content="Study angles web site" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Headline />
      </main>
      <Footer />
    </>
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