import type { Metadata } from 'next';
import './globals.css';
import { resolveImageUrl } from '@/lib/resolveImageUrl';
import { getSiteContent } from '@/lib/siteContent';

export async function generateMetadata(): Promise<Metadata> {
  const content = getSiteContent();
  const img = resolveImageUrl(content.ogImage ?? content.coverPhoto);
  const description = content.tagline || content.bioShort;

  return {
    title: content.djName,
    description,
    openGraph: {
      title: content.djName,
      description,
      images: [{ url: img }]
    },
    twitter: {
      card: 'summary_large_image',
      title: content.djName,
      description,
      images: [img]
    }
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
