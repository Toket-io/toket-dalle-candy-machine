import "@/styles/globals.css";
import "@/styles/custom.scss";
// import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import { SSRProvider } from "react-bootstrap";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  );
}
