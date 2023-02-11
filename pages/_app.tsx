import {ChakraProvider} from "@chakra-ui/react";
import theme from "../theme";
import type {AppProps} from 'next/app'
import Script from "next/script";
import Head from "next/head";
import {RecoilRoot} from "recoil";

export default function App({Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Wizarding Pay</title>
          <meta
            name="description"
            content="ChatGPT via Wizarding Pay"
          />
          <meta name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
          <meta content={'yes'} name={"apple-mobile-web-app-capable"}/>
          <meta content={'yes'} name={"mobile-web-app-capable"}/>
          <meta content={'black'} name={"apple-mobile-web-app-status-bar-style"}/>
          <meta content={'ChatGPT'} name={"apple-mobile-web-app-title"}/>
          <meta content={'telephone=no'} name={"format-detection"}/>
          <meta content={'email=no'} name={"format-detection"}/>
          <meta name="theme-color" content="#202123"/>
          <link rel="icon" href="/favicon.svg"/>
        </Head>

        <Script src={"https://telegram.org/js/games.js"}/>
        <Script id={"telegram-web-app"} src={"https://telegram.org/js/telegram-web-app.js"}/>
        <Script src={"https://www.googletagmanager.com/gtag/js?id=G-EDPQ3K7EN8"}></Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('config', 'G-EDPQ3K7EN8');
              `}
        </Script>
        <Component {...pageProps} />
      </ChakraProvider>
    </RecoilRoot>
  )
}
