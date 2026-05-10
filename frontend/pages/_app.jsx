import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { LanguageProvider } from "../lib/i18n";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // Dashboard areas bring their own sidebar/header layout
  const hasOwnLayout =
    router.pathname.startsWith("/citizen") || router.pathname.startsWith("/employee");

  return (
    <LanguageProvider>
      {hasOwnLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </LanguageProvider>
  );
}
