import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { SyncProvider } from "@/offline/SyncProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContext";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Management Ledger",
  description: "This app created for management",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    shortcut: "/favicon/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="./favicon/site.webmanifest" />
      </head>

      <body className={`${vazirmatn.variable} font-sans antialiased bg-gray-50`}>
        {/* <AuthProvider > */}
          <Providers>
            <SyncProvider />
            <ClientLayout>{children}</ClientLayout>
          </Providers>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
