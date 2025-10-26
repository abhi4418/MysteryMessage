import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mystery Message',
  description: 'Real feedback from real people.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <div className="flex-1">
            {children}
          </div>
          <footer className="w-full py-4 fixed bottom-0 text-center text-sm text-muted-foreground border-t">
            Developed by 💖 <a className='text-white underline' href="https://github.com/aashishpanwar05/" target="_blank" rel="noopener noreferrer">Aashish Kumar</a>
          </footer>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}

