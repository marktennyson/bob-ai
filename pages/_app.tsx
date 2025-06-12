import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"], // Or other subsets you need
  weight: ["400", "700"], // Or desired weights
  style: ["normal"], // Or other styles
  display: "swap", // Recommended for performance
  variable: "--font-nunito", // Optional, for defining a CSS variable
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${nunito.className} bg-gray-100 dark:bg-gray-900 min-h-screen`}
    >
      <Component {...pageProps} />
    </main>
  );
}
