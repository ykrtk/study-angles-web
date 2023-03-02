import '@/styles/globals.scss';
import { NextIntlProvider } from 'next-intl';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { AngleProvider } from '@/components/providers/AngleProvider';

export default function App({ Component, pageProps }: AppProps) {
    // If you don't use internationalized routing, you need to pass a `locale` to the provider.
    return (
        <>
            <NextIntlProvider messages={pageProps.messages}>
                <AngleProvider>
                    <Component {...pageProps} />
                </AngleProvider>
            </NextIntlProvider>
            <Analytics />
        </>
    );
}
