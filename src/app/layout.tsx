import type {Metadata} from 'next';
import { Poppins } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AlertTriangle } from 'lucide-react';

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
    <html lang="en" className="h-full">
      <body className={`${poppins.variable} ${headlineFont.variable} font-body antialiased flex flex-col h-full`}>
        <div className="flex-grow">
          {children}
        </div>
        <div className="container mx-auto px-4 mt-8">
            <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md" role="alert">
                <div className="flex">
                    <div className="py-1"><AlertTriangle className="h-5 w-5 text-amber-500 mr-3" /></div>
                    <div>
                        <p className="font-bold">A Note on AI Recipes</p>
                        <p className="text-sm">While our AI provides creative suggestions, always use your best judgment. Please review ingredients and instructions carefully. Happy cooking!</p>
                    </div>
                </div>
            </div>
        </div>
        <footer className="bg-primary text-primary-foreground border-t py-4 mt-8">
            <div className="container mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} AI Recipe Assistant. All Rights Reserved.</p>
            </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
