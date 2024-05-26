// pages/_app.js
import React from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  const router = useRouter();


  return <Component {...pageProps} />;
}

export default App;