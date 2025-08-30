import type {Metadata} from 'next';
import { Poppins } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
});

const headlineFont = Poppins({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'AI Recipe Assistant',
  description: 'Get AI-generated meal ideas from the ingredients you have.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${headlineFont.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
