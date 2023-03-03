import {ChakraProvider, Stack} from '@chakra-ui/react';
import theme from '../theme';
import type {AppProps} from 'next/app'
import Script from 'next/script';
import Head from 'next/head';
import useWindowSize from '@/hooks/useWindowSize';
import {Provider} from 'react-redux'
import store from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import { Spinner } from '@chakra-ui/react'
import '@/pages/styles/github-markdown.css';

const persistor = persistStore(store);

export default function App({Component, pageProps}: AppProps) {
  const {height} = useWindowSize()

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Spinner color='#10A37F'/>}>
        <ChakraProvider theme={theme}>
          <Head>
            <title>ChatGPT</title>
            <meta
              name='description'
              content='A free conversational AI system that listens, learns, and challenges'
            />
            <meta name='viewport'
                  content='width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
            <meta name={'apple-mobile-web-app-capable'} content={'yes'}/>
            <meta name={'mobile-web-app-capable'} content={'yes'}/>
            <meta name={'apple-mobile-web-app-status-bar-style'} content={'black'}/>
            <meta name={'apple-mobile-web-app-title'} content={'ChatGPT'}/>
            <meta name={'format-detection'} content={'telephone=no'}/>
            <meta name={'format-detection'} content={'email=no'}/>
            <meta name='theme-color' content='#343541'/>
            <meta property='og:image' content='/apple-touch-icon.png'/>
            <meta property='og:title' content='ChatGPT'/>
            <meta property='og:description'
                  content='A free conversational AI system that listens, learns, and challenges'/>
            <meta property='og:url' content='https://chatgpt.wizardingpay.com'/>
            <link rel='icon' href='/favicon.ico'/>
            <link rel='icon' href={'/favicon.svg'} type='image/svg+xml'/>
            <link rel='icon' href={'/favicon.png'} type='image/png'/>
            <link rel='apple-touch-icon' href={'/apple-touch-icon.png'} sizes={'180x180'} type='image/png'/>
            <link rel='mask-icon' href={'favicon.svg'} color='#343541' type='image/svg+xml'/>
          </Head>
          <Script src={'https://telegram.org/js/games.js'}/>
          <Script id={'telegram-web-app'} src={'https://telegram.org/js/telegram-web-app.js'}/>
          <Script src={'https://www.googletagmanager.com/gtag/js?id=G-EDPQ3K7EN8'}/>
          <Script id={'telegram'} src={'https://telegram.org/js/telegram-widget.js'}/>
          <Script id='google-tag-manager' strategy='afterInteractive'>
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-EDPQ3K7EN8');
              `}
          </Script>
          {
            height && (
              <Stack h={height} spacing={0}>
                <Component {...pageProps} />
              </Stack>
            )
          }
        </ChakraProvider>
      </PersistGate>
    </Provider>
  )
}
