import 'tw-elements/dist/css/tw-elements.min.css';
import '@/styles/global.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Roboto } from 'next/font/google';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks');
}

const roboto = Roboto({ weight: '400', subsets: ['latin'] });

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Url Shortener</title>
        <style jsx global>{`
          html {
            font-family: ${roboto.style.fontFamily};
          }
        `}</style>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
