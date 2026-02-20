import "./globals.css";
import { Newsreader, Space_Mono, Fjalla_One } from 'next/font/google';
import Script from 'next/script';
import StewardshipPanel from "../components/StewardshipPanel";

const instrumentSerif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
  adjustFontFallback: false, // suppresses the override warning
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space-mono',
  display: 'swap',
});

const fjallaOne = Fjalla_One({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--font-fjalla',
  display: 'swap',
});

/**
 * Institutional Identity // Principal Resolution
 * Focus: High-authority SEO and Executive Scale Accessibility.
 * Tenet: Absolute Candor.
 */
export const metadata = {
  title: {
    default: "Principal Resolution // Direct Institutional Partnership",
    template: "%s | Principal Resolution"
  },
  description: "Resolving the unwritten conflicts that stop growth. We address the 'Human Variable' with absolute candor to recover institutional velocity.",
  openGraph: {
    title: "Principal Resolution",
    description: "Direct resolution for executive friction and institutional drift.",
    url: "https://principalresolution.com",
    siteName: "Principal Resolution",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🏛️ RB2B STEALTH INTELLIGENCE // QOQRJH9G7V62 */}
        <Script
          id="rb2b-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(key) {
                if (window.reb2b) return;
                window.reb2b = {loaded: true};
                var s = document.createElement("script");
                s.async = true;
                s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
                var first = document.getElementsByTagName("script")[0];
                first.parentNode.insertBefore(s, first);
              }("QOQRJH9G7V62");
            `,
          }}
        />
      </head>
      <body className={`
        ${instrumentSerif.variable}
        ${spaceMono.variable}
        ${fjallaOne.variable}
        font-sans antialiased
      `}>
        {/* Prevents white flash on theme load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('pr-theme') || 'harbor';
                document.documentElement.setAttribute('data-theme', theme);
              })()
            `,
          }}
        />
        {children}
        <StewardshipPanel />
      </body>
    </html>
  );
}