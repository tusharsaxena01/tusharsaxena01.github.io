import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_Devanagari, Rajdhani } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const display = Rajdhani({ subsets: ["latin", "devanagari"], weight: ["500", "600", "700"], variable: "--font-display" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "600", "700"], variable: "--font-deva" });

export const metadata: Metadata = {
  title: "Abhi Saxena | Full Stack Developer",
  icons: {
    icon: "https://avatars.githubusercontent.com/u/71825717?v=4"
  },
  description: "Systems over Interfaces. Performance is a feature.",
};

export const viewport: Viewport = { themeColor: "#0c0a12" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Gate reveal-hiding on JS so no-JS visitors still see every section. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={`${mono.variable} ${display.variable} ${deva.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
