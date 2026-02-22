import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DJ-Shortcut',
  description: 'Music for the mind. Electronic Dance Music and Other things I like.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
