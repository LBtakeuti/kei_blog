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
  title: {
    default: 'My Blog',
    template: '%s | My Blog'
  },
  description: 'Welcome to my blog where I share my thoughts and experiences',
  openGraph: {
    title: 'My Blog',
    description: 'Welcome to my blog where I share my thoughts and experiences',
    url: 'https://yourdomain.com',
    siteName: 'My Blog',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog',
    description: 'Welcome to my blog where I share my thoughts and experiences',
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
          {/* 背景画像 */}
          <div 
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: `url('data:image/jpeg;base64,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')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              filter: 'brightness(0.7)'
            }}
          />
          {/* コンテンツ層 */}
          <div className="relative z-10 flex size-full min-h-screen flex-col bg-white/90 backdrop-blur-sm">
            <div className="layout-container flex h-full grow flex-col">
              <Header />
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
