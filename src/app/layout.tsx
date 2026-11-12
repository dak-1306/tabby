import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ClientShell } from "@/components/common/ClientShell";
import "./globals.css";
import { DemoProvider } from "@/contexts/DemoContext";
import { DemoOverlay } from "@/components/common/DemoOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tabby - Chia tiền sòng phẳng",
  description: "Ứng dụng quản lý và chia tiền hóa đơn PWA offline-first",
  icons: {
    icon: [{ url: "/icons/logo.svg", type: "image/svg+xml" }],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tabby",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-foreground antialiased overscroll-none select-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientShell>
            {/* Khung chứa app cố định chiều cao bằng 100dvh, tràn nền tự nhiên */}
            <div className="mx-auto max-w-md h-[100dvh] flex flex-col bg-background relative shadow-2xl overflow-hidden">
              <DemoProvider>
                {/* Overlay và Banner Top đứng cố định toàn app */}
                <DemoOverlay />
                {children}
              </DemoProvider>
            </div>
          </ClientShell>
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
