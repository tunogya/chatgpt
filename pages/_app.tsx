import type {AppProps} from 'next/app';
import Script from 'next/script';
import Head from 'next/head';
import {Provider, useSelector} from 'react-redux'
import store from "@/store";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import {UserProvider} from '@auth0/nextjs-auth0/client';
import LoadingIcon from "@/components/SVG/LoadingIcon";
import {useEffect} from "react";
// import "tailwindcss/tailwind.css";
import "@/styles/index.css";

const persistor = persistStore(store);

const AutoTheme = () => {
  const theme = useSelector((state: any) => state.ui.theme);

  useEffect(() => {
    const handleChangeColorScheme = (e: any) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      handleChangeColorScheme(mediaQuery)
      mediaQuery.addEventListener('change', handleChangeColorScheme);
      return () => {
        mediaQuery.removeEventListener('change', handleChangeColorScheme);
      };
    }
  }, [theme])

  return null
}

export default function App({Component, pageProps}: AppProps) {
  return (
    <Provider store={store}>
      <AutoTheme />
      <PersistGate persistor={persistor} loading={<div className={'pt-4'}><LoadingIcon/></div>}>
        <Head>
          <title>ChatGPT</title>
          <meta
            name='description'
            content='全球通用的ChatGPT工具，超低月费，性能稳定不封号，生产效率直翻倍。限时免费试用3天，助你早日实现AI自由。'
          />
          <meta name='viewport'
                content='width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'/>
          <meta name={'apple-mobile-web-app-capable'} content={'yes'}/>
          <meta name={'mobile-web-app-capable'} content={'yes'}/>
          <meta name={'apple-mobile-web-app-status-bar-style'} content={'black'}/>
          <meta name={'apple-mobile-web-app-title'} content={'ChatGPT | Abandon.Chat'}/>
          <meta name={'format-detection'} content={'telephone=no'}/>
          <meta name={'format-detection'} content={'email=no'}/>
          <meta name='theme-color' content='#202123'/>
          <meta property='og:image' content='/apple-touch-icon.png'/>
          <meta property='og:title' content='ChatGPT'/>
          <meta property='og:description'
                content='全球通用的ChatGPT工具，超低月费，性能稳定不封号，生产效率直翻倍。限时免费试用3天，助你早日实现AI自由。'/>
          <meta property='og:url' content='https://www.abandon.chat'/>
          <link rel="manifest" href={"manifest.json"}/>
          <link rel='icon' href='/favicon.ico'/>
          <link rel='icon' href={'/favicon.svg'} type='image/svg+xml'/>
          <link rel='icon' href={'/favicon.png'} type='image/png'/>
          <link rel='apple-touch-icon' href={'/apple-touch-icon.png'} sizes={'180x180'} type='image/png'/>
          <link rel='mask-icon' href={'favicon.svg'} color='#343541' type='image/svg+xml'/>
        </Head>
        <Script src={'https://www.googletagmanager.com/gtag/js?id=G-EDPQ3K7EN8'}/>
        <Script id='google-tag-manager' strategy='afterInteractive'>
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-EDPQ3K7EN8');
              `}
        </Script>
        <Script id={'sw'}>
          {`
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
        `}
        </Script>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </PersistGate>
    </Provider>
  )
}
