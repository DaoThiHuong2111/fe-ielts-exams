import { ConditionalLayout } from "@/components/conditional-layout";
import { AppProvider } from "@/contexts/app-context";
import { getUserBe } from "@services/backend.service";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Luyện thi IELTS",
  description: "Luyện thi IELTS - Đề gốc, đề thật, đề mới nhất",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resUser = await getUserBe()
  
  return (
    <html lang="en" translate="no">
      <body
        className={`${inter.className}`}
      >
        <AppProvider initUser={resUser}>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
