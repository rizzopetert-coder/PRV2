import "./globals.css";
import { Instrument_Serif, Inter } from "next/font/google";
import Script from 'next/script';
import ThemeToggle from "../components/ThemeToggle";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/**
 * Institutional Identity // Principal Resolution
 * Focus: High-authority SEO for board-level search results.
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
      <body className={`${instrumentSerif.variable} ${inter.variable} font-sans antialiased`}>
        {/* The theme script prevents the white flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('pr-theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })()
            `,
          }}
        />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}