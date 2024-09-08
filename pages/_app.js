import "@/styles/globals.css";
import Head from 'next/head';

import { SocketProvider } from "@/context/socket";

export default function App({ Component, pageProps }) {
  return (
    <SocketProvider>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Birthstone+Bounce:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </SocketProvider>
  );
}
