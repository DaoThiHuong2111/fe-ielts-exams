import FooterApp from "@/components/footer";
import HeaderApp from "@/components/header";
import { AppProvider } from "@/contexts/app-context";
import { getUserBe } from "@services/backend.service";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "../globals.css";

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
      <body className="font-sans">
        <AppProvider initUser={resUser}>
          <HeaderApp />
          {children}
          <FooterApp />
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
