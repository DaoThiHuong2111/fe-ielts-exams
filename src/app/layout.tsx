import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/auth-context';
import ToastProvider from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'IELTS Exams',
  description: 'Platform for IELTS exam preparation and practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" translate="no">
      <body className="font-sans">
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}