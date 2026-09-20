import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "克祥雕刻艺术 | Kexiang Sculpture Art",
  description: "步入克祥雕刻艺术线上长廊，探索雕塑作品，交流收藏与预定意向。",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
