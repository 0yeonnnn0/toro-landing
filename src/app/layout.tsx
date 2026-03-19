import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TORO - AI 디스코드 봇 | 친구같은 대화 AI",
  description:
    "실제 대화 데이터를 학습한 캐릭터 AI가 디스코드에서 자연스럽게 대화에 참여합니다. 다중 AI 프로바이더, RAG 시스템, 이미지 생성까지.",
  openGraph: {
    title: "TORO - AI 디스코드 봇",
    description: "친구같은 대화 AI, 디스코드에서 만나보세요",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
