import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui";
import AuthProvider from "@/components/providers/auth-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VoteUP | 누구나 쉽게 만드는 실시간 투표",
  description: "스트리밍 이벤트, 세미나, 온라인 모임을 위한 실시간 투표 서비스",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "VoteUP | 누구나 쉽게 만드는 실시간 투표",
    description:
      "스트리밍 이벤트, 세미나, 온라인 모임을 위한 실시간 투표 서비스",
    url: "https://voteup-lake.vercel.app",
    images: [
      {
        url: "/main-og.png",
        width: 1200,
        height: 630,
        alt: "VoteUP | 누구나 쉽게 만드는 실시간 투표 - 커버 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-white flex flex-col`}
        suppressHydrationWarning
      >
        <Analytics />
        <AuthProvider>
          <main className="flex-1">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
