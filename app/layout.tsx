
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes'
import 'katex/dist/katex.min.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mリーグ Rating ",
  description: "Mリーグの選手のレーティング非公式サイトです。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 2. suppressHydrationWarning を追加（テーマ切り替え時のエラー防止）
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* 3. ThemeProvider で children を囲む */}
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

