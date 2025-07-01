// app/_app.tsx
import { Slot } from "expo-router";
import Head from "expo-router/head";
import React from "react";

export default function App() {
  return (
    <>
      {/* Inject Google Fonts for web */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,400;0,700;1,900&display=swap"
          rel="stylesheet"
        />
        {/* Optional: apply global fallback font family on web */}
        <style>{`
          html, body {
            font-family: 'Montserrat', sans-serif;
          }
        `}</style>
      </Head>

      {/* Slot renders the rest of your app */}
      <Slot />
    </>
  );
}
