import type { Metadata } from "next";
import { Newsreader, Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const newsreader = Newsreader({
  weight: ['400', '500', '700', '800'],
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const notoSans = Noto_Sans({
  weight: ['400', '500', '700', '900'],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Bloggr",
  description: "A modern blog platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${newsreader.variable} ${notoSans.variable} antialiased`}
        style={{ fontFamily: 'var(--font-newsreader), var(--font-noto-sans), sans-serif' }}
      >
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
