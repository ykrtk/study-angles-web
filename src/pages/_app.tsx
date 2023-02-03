import '@/styles/globals.css';
import { NextIntlProvider } from 'next-intl';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  // If you don't use internationalized routing, you need to pass a `locale` to the provider.
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <Component {...pageProps} />
    </NextIntlProvider>
  );
}
