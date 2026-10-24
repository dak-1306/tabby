import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileContainer } from "@/components/common/MobileContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tabby - Chia tiền sòng phẳng & Tinh tế",
  description: "Web App mobile chia tiền hóa đơn nhanh gọn, lưu LocalStorage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/20`}
      >
        <MobileContainer>{children}</MobileContainer>
      </body>
    </html>
  );
}
