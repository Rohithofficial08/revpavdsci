import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { ThemeProvider } from "@/components/layout/ThemeContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <title>AI Cyber Forensics Platform</title>
        <meta name="description" content="AI-powered Security Operations Center" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
