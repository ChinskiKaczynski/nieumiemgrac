import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NieUmiemGrac.pl - Strona streamera",
  description: "Oficjalna strona streamera NieUmiemGrac - stream, chat, VODy, klipy i więcej!",
  keywords: "streaming, gry, twitch, youtube, nieumiem, grać, streamer, vod, klipy",
  authors: [{ name: "NieUmiemGrac" }],
  creator: "NieUmiemGrac",
  publisher: "NieUmiemGrac",
  openGraph: {
    title: "NieUmiemGrac.pl - Oficjalna strona streamera",
    description: "Stream, chat, VODy, klipy i więcej!",
    url: "https://nieumiemgrac.pl",
    siteName: "NieUmiemGrac.pl",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NieUmiemGrac.pl - Oficjalna strona streamera",
    description: "Stream, chat, VODy, klipy i więcej!",
    creator: "@nieumiemgrac",
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
    <html lang="pl" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-dark-400 dark:text-light-100`}
      >
        {children}
      </body>
    </html>
  );
}
