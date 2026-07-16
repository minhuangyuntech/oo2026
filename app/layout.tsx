import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "物件導向程式設計｜Python 課程教材",
  description: "18 週物件導向程式設計課程：從 Python 基礎、類別與封裝，到 SOLID、設計模式、測試與系統整合。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
