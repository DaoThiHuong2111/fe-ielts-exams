import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { SessionService } from '@/services/session.service';
import ToastProvider from '@/components/ui/toast';
import { ErrorBoundary } from '@/components/error-fallback';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IELTS Exams',
  description: 'Platform for IELTS exam preparation and practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize session service on the server side
  // This will be used by the AuthProvider on the client side
  if (typeof window !== 'undefined') {
    SessionService.getInstance().initialize();
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}